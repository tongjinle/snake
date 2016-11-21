(function() {
	var conf = this.conf = this.conf || {};

	conf.map = {
		createInterval: 2000,
		size:20
	};

	conf.snake = {
		speed: 4,
		maxSpeed:8,
		aiSpeed:10,
		directions: {
			up: 0,
			right: 1,
			down: 2,
			left: 3
		},
		pathInterval:1000

	};

	
	
	conf.user ={
		stopCount:1,
		minCount:2,
		maxCount:4
	};

	
	module.exports = conf;

}).call(this);