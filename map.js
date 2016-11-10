(function() {
	function Map(width, height) {
		this.width = width;
		this.height = height;
	}

	var handle = Map.prototype;

	handle.createFruit = function() {
		console.log('map createFruit');
	};

	handle.createInterval = this.conf.map.createInterval * 1000;

	this.Map = Map;

}).call(this);