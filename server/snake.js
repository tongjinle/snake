var conf = require('./config');

(function() {
	var directions = conf.snake.directions;

	function Snake(x, y) {
		this.head = {
			x: x,
			y: y
		};

		this.isAlive = true;
		this.tails = [];
		this.direction = directions.right;
		this.speed = conf.snake.speed;

		// 记录上一个最后的位置
		this._lastPosi = null;
		// 移动过位置的方向
		this._movedDire = this.direction;


		// 移动的路径
		// speed表示1ms移动的路径
		// 如果超过pathInterval,则让snake移动一格
		// 如果转向,则清0
		this._moved = 0;


	}

	var handle = Snake.prototype;


	handle.setGame = function(game){
		this.game = game;
	};

	// dt表示过去的时间
	handle.moveByTime = function(dt){
		var pathInterval = conf.snake.pathInterval;
		this._moved += dt * this.speed;
		if(this._moved>=pathInterval){
			this._moved -=pathInterval;
			this.move();
		}
	};

	handle.move = function() {
		if (!this.isAlive) {
			return;
		}

		var next = {
			x: this.head.x,
			y: this.head.y
		};
		if (this.direction == directions.up) {
			next.y--;
		} else if (this.direction == directions.right) {
			next.x++;
		} else if (this.direction == directions.down) {
			next.y++;
		} else if (this.direction == directions.left) {
			next.x--;
		}else {
			throw this.direction;
		}

		// 记录上一个最后节点的位置
		/* START */
		var finalNode =
			this.tails.length ? this.tails[this.tails.length - 1] : this.head;
		this._lastPosi = {
			x: finalNode.x,
			y: finalNode.y
		};

		// console.log('sn move ...',this.head);
		/* END */


		// 移动

		/* START */
		for (var i = this.tails.length - 1; i >= 0; i--) {
			var tailNode = this.tails[i];
			var prevNode = i == 0 ? this.head : this.tails[i - 1];
			tailNode.x = prevNode.x;
			tailNode.y = prevNode.y;
		}
		this.head.x = next.x;
		this.head.y = next.y;

		this._movedDire = this.direction;
		/* END */

		// 超出边界就死
		if (this.game.ask('#isOutOfMap',this.head)) {
			this.die();
			return;
		}

		// 吃到自己就会死
		var eatSelf = function(tail) {
			return tail.x == this.head.x && tail.y == this.head.y;
		}.bind(this);
		if (this.tails.find(eatSelf)) {
			this.die();
			return;
		}

		// 吃到水果
		if (this.game.ask('#isFruit',this.head)){
			this.eat();
		}



	};

	// 死亡
	handle.die = function() {
		this.isAlive = false;
		this.game.ask('#snakeDie',this);
	};
		// 吃东西
	handle.eat = function() {
		console.log('snake has eat fruit');
		node = {
			x: this._lastPosi.x,
			y: this._lastPosi.y
		};
		this.tails.push(node);

		// 清理水果
		this.game.ask('#eatFruit');
	};

	// 转向
	handle.turn = function(dire) {
		var _lastDire = this.direction;
		if (!this.tails.length || (dire + this._movedDire) % 2) {
			this.direction = dire;
		}
		if(_lastDire != this.direction){
			// this._moved = 0;
		}
	};


	// ai
	// 策略:
	// 当前方向的前方缺少5个连续空格的时候
	// 4个方向中(除去回退方向),连续空格最多的方向是选择的方向
	handle.ai = function(){
		if(this._hasAiEnoughSpace(5)){
			return;
		}
		this.direction = this._getAiDirection(); 
	};

	handle._getSpaceCountByDirection = function(posi,dire){
		return  this.game.ask('#getSpaceCountByDirection',posi,dire);
	};

	// 前方是否有N个空格
	handle._hasAiEnoughSpace = function(n) {
		return this._getSpaceCountByDirection(this.head,this.direction)>=n;
	};
	
	handle._getAiDirection = function(){
		var count = -1;
		var direction = this.direction;
		for(var i in conf.snake.directions){
			var dire = conf.snake.directions[i];
			var spaceCount = this.game.ask('#getSpaceCountByDirection',this.head,dire);
			if(count<spaceCount){
				count = spaceCount;
				direction = dire;
			}
		}
		return direction;
	};


	this.Snake = Snake;


	module.exports = Snake;
}).call(this);