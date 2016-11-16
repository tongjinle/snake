(function() {
	var conf = this.conf = this.conf || {};

	conf.map = {
		size: 30
	};

	conf.snake = {
		directions: {
			up: 0,
			right: 1,
			down: 2,
			left: 3
		},
		size: 30

	};

	conf.fruit ={
		size:30
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
	}

}).call(this);