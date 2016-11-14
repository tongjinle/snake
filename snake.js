// head
// tails
// direction
// speed

// move
// eat
// turn


(function() {
	var conf = this.conf;
	var directions = conf.snake.directions;

	function Snake(x, y) {
		this.head = {
			x: x,
			y: y
		};

		this.isAlive = true;
		this.map = null;
		this.tails = [];
		this.direction = directions.right;
		this.speed = conf.snake.speed;

		// 记录上一个最后的位置
		this._lastPosi = null;
		// 移动过位置的方向
		this._movedDire = this.direction;
	}

	var handle = Snake.prototype;

	handle.setMap = function(map) {
		this.map = map;
	}

	handle.move = function() {
		if (!this.isAlive) {
			return;
		}

		console.log('sn move ...');

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
		}

		// 记录上一个最后节点的位置
		/* START */
		var finalNode =
			this.tails.length ? this.tails[this.tails.length - 1] : this.head;
		this._lastPosi = {
			x: finalNode.x,
			y: finalNode.y
		};
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
		if (this._isOutOfMap()) {
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
		if (this.map.fruit && this.head.x == this.map.fruit.x && this.head.y == this.map.fruit.y) {
			this.eat();
		}

	};

	// 死亡
	handle.die = function() {
			this.isAlive = false;
		}
		// 吃东西
	handle.eat = function() {
		console.log('snake has eat fruit');
		node = {
			x: this._lastPosi.x,
			y: this._lastPosi.y
		};
		this.tails.push(node);

		// 清理水果
		this.map.fruit = null;
	};

	// 转向
	handle.turn = function(dire) {
		if (!this.tails.length || (dire + this._movedDire) % 2) {
			this.direction = dire;
		}
	};

	// 是否超出map
	handle._isOutOfMap = function() {
		return this.head.x < 0 || this.head.x >= this.map.width || this.head.y < 0 || this.head.y >= this.map.height;
	};



	this.Snake = Snake;
}).call(this);