(function() {
	var conf = this.conf = this.conf || {};

	conf.map = {
		createInterval: 3,
		// createInterval: 10,
		size: 30
	};

	conf.snake = {
		speed: 400,
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


	}

}).call(this);