(function() {
	var conf = this.conf = this.conf || {};

	conf.map = {
		createInterval: 3,
		size:20
	};

	conf.snake = {
		speed: 800,
		directions: {
			up: 0,
			right: 1,
			down: 2,
			left: 3
		}

	};

	conf.keys = {
		up: 119,
		right: 100,
		down: 115,
		left: 97


	};

	
	conf.user ={
		minCount:2,
		maxCount:4
	};

	
	module.exports = conf;

}).call(this);