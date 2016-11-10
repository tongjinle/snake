// head
// tails
// direction
// speed

// move
// eat
// turn

var directions = {
	up: 0,
	right: 1,
	down: 2,
	left: 3
};

(function() {
	var conf = this.conf;

	function Snake(x, y) {
		this.head = {
			x: x,
			y: y
		};

		this.tails = [];
		this.direction = directions.up;
		this.speed = conf.snake.speed;
	}

	var handle = Snake.prototype;

	handle.move = function() {
		console.log('sn move ...');
	};

	handle.eat = function() {};
	handle.turn = function() {};

	this.Snake = Snake;
}).call(this);