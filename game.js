// 60 frames
// 16.6ms

var frames = 60;
var interval = 1000 / frames;
var lastTs = null;
var tick = 0;

var sn;

var game = {
	start: function() {
		this.listen();

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
		renderMap(map);
		sn = new Snake(0, 0);
		sn.setMap(map);
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
	listen: function() {
		$(window).bind('keypress', function(e) {
			var keyCode = e.keyCode;
			var keys = conf.keys;
			if (keyCode == keys.up) {
				sn.turn(conf.snake.directions.up);
			} else if (keyCode == keys.right) {
				sn.turn(conf.snake.directions.right);

			} else if (keyCode == keys.down) {
				sn.turn(conf.snake.directions.down);

			} else if (keyCode == keys.left) {
				sn.turn(conf.snake.directions.left);
			}
		});
	},
	unbind: function() {
		this._list.length = 0;
		console.log('game is over');
	},
	_list: []
};

$(function() {

	game.init();

	game.schedule(function() {
		sn.move();
		renderSnake(sn);
	}, 100 / sn.speed * 1000);

	game.schedule(function() {
		var count =100;
		while (count--) {
			map.createFruit();
			if (!(sn.head.x == map.fruit.x && sn.head.y == map.fruit.y)) {
				break;
			}
		}
	}, map.createInterval);

	game.schedule(function(){
		renderFruit(map.fruit);

	},20);

	game.schedule(function() {
		if (!sn.isAlive) {
			game.unbind();
		}
	}, 50);

	game.start();


});

function renderSnake(sn) {
	var body = $('body');
	var snake = $('#snake');
	var size = conf.snake.size;


	// head
	if (!snake.length) {
		snake = $('<div id="snake"></div>')
			.css({
				width: size,
				height: size,
				position: 'absolute',
				background: 'red'
			});
		body.append(snake);
	}

	snake.css({
		top: sn.head.y * size,
		left: sn.head.x * size
	});

	// tails
	for (var i = 0; i < sn.tails.length; i++) {
		var tail = $('.tail.tail_' + i);
		if (!tail.length) {
			tail = $('<div class="tail tail_' + i + '"></div>').
			css({
				width: size,
				height: size,
				position: 'absolute',
				background: 'pink'
			});
			body.append(tail);
		}

		tail.css({
			top: sn.tails[i].y * size,
			left: sn.tails[i].x * size
		});
	}

}


function renderMap(snakeMap) {
	var body = $('body');
	var map = $('#map');
	var size = conf.map.size;
	if (!map.length) {
		map = $('<div id="map"></div>');
		for (var i = 0; i < snakeMap.width; i++) {
			for (var j = 0; j < snakeMap.height; j++) {
				map.append($('<div class="box" />').css({
					width: size,
					height: size,
					position: 'absolute',
					top: j * size,
					left: i * size,
					background: (i + j) % 2 ? 'white' : 'black'
				}));

			}
		}
		body.append(map);
	}



}

function renderFruit(mapFruit) {
	var body = $('body');

	// 渲染水果
	var fruit = $('#fruit');
	var size = conf.fruit.size;
	if (!fruit.length) {
		fruit = $('<div id="fruit"></div>')
			.css({
				width: size,
				height: size,
				position: 'absolute',
				background: 'orange'
			})
			.hide();
		body.append(fruit);

	}
	if (mapFruit) {
		fruit.css({
				top: mapFruit.y * size,
				left: mapFruit.x * size
			})
			.show();
	} else {
		fruit.hide();
	}
}