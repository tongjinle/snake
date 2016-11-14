(function() {
	function Map(width, height) {
		this.width = width;
		this.height = height;

		this.fruit = null;
	}

	var handle = Map.prototype;

	handle.createFruit = function() {
		if(this.fruit){
			return;
		}
		this.fruit = {
			x:Math.floor(Math.random()*this.width),
			y:Math.floor(Math.random()*this.height)
		};
		console.log('map createFruit');
	};

	handle.createInterval = this.conf.map.createInterval * 1000;

	this.Map = Map;

}).call(this);