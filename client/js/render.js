(function() {

	function Render(ctx, width, height) {
		this.ctx = ctx;
		this.width = width;
		this.height = height;
	}

	var handler = Render.prototype;

	handler.clear = function() {
		this.ctx.clearRect(0, 0, this.width, this.height);
	};


	handler.rect = function(x, y, width, height, color) {
		this.ctx.fillStyle = color;
		this.ctx.fillRect(x, y, width, height);
	};


	/////////////////////////


	handler.renderGame = function(info) {
		// clear
		this.clear();
		// map
		this._renderMap(info.map);

		// snake
		var snakeList = info.snakeList;
		snakeList&& snakeList.forEach(function(sn) {
			this._renderSnake(sn);
		}.bind(this));
		
		// fruit
		this._renderFruit(info.fruit);

	};

	handler._renderMap = function(mapInfo) {
		var mapSize = conf.map.size;
		for (var i = 0; i < mapInfo.width; i++) {
			for (var j = 0; j < mapInfo.height; j++) {
				this.rect(i * mapSize, j * mapSize, mapSize, mapSize, (i + j) % 2 ? 'black' : 'white');
			}
		}
	};

	handler._renderSnake = function(snakeInfo) {
		var snakeSize = conf.snake.size;
		var sn = snakeInfo;
		this.rect(sn.head.x * snakeSize, sn.head.y * snakeSize, snakeSize, snakeSize, sn.color);
		sn.tails.forEach(function(tail) {
			this.rect(tail.x * snakeSize, tail.y * snakeSize, snakeSize, snakeSize, sn.tailColor);
		}.bind(this));
	};

	handler._renderFruit = function(fruitInfo) {
		var fruitSize = conf.fruit.size;
		fruitInfo && this.rect(fruitInfo.x * fruitSize, fruitInfo.y * fruitSize, fruitSize, fruitSize, 'green');
	}

	///////////////


	this.Render = Render;
}).call(this);