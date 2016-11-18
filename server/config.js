(function() {
	var conf = this.conf = this.conf || {};

	conf.map = {
		createInterval: 3,
		size:20
	};

	conf.snake = {
		speed: 100,
		directions: {
			up: 0,
			right: 1,
			down: 2,
			left: 3
		}

	};

	
	
	conf.user ={
		minCount:1,
		maxCount:4
	};

	
	module.exports = conf;

}).call(this);