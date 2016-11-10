// 60 frames
// 16.6ms

var frames = 60;
var interval = 1000 / frames;
var lastTs = null;
var tick = 0;

var sn;

var game = {
	start: function() {
		lastTs = +new Date;
		setInterval(function() {
			var currTs = +new Date;
			var dt = currTs - lastTs;
			lastTs = currTs;
			this.update(dt);
		}.bind(this), interval);
	},
	init: function() {
		map = new Map(10, 10);
		sn = new Snake(0, 0);
		console.log('game init');
	},
	// dt表示过去了多少时间
	update: function(dt) {
		for (var i = 0; i < this._list.length; i++) {
			var ai = this._list[i];
			ai.tick += dt;
			if (ai.tick >= ai.interval) {
				ai.action();
				ai.tick -= ai.interval
			}
		}
	},
	schedule: function(action, interval) {
		this._list.push({
			action: action,
			interval: interval,
			tick: 0
		});
	},
	_list: []
};

game.init();

game.schedule(function() {
	sn.move();
}, 100 / sn.speed * 1000);

game.schedule(function() {
	map.createFruit();
}, map.createInterval);

game.start();
