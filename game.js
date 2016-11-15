// 60 frames
// 16.6ms

var frames = 60;
var interval = 1000 / frames;
var lastTs = null;
var tick = 0;

var sn;
var map;
var render;

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

		sn = new Snake(0, 0);
		sn.setMap(map);
		
		this.setRender();

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
	setRender:function(){
		var myCanvas = $("#myCanvas");
		var width = map.width * conf.map.size;
		var height = map.height * conf.map.size;
		myCanvas.attr({
			width:width,
			height:height
		});
		var ctx=myCanvas[0].getContext("2d");
		this.render = new Render(ctx,width,height);

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
		// renderSnake(sn);
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

	// game.schedule(function(){
	// 	// renderFruit(map.fruit);

	// },20);

	game.schedule(function() {
		if (!sn.isAlive) {
			game.unbind();
		}
	}, 50);

	game.schedule(function(){
		var render = this.render;
		// clear
		render.clear();
		// map
		var mapSize = conf.map.size;
		for (var i = 0; i < map.width; i++) {
			for (var j = 0; j < map.height; j++) {
				render.rect(i*mapSize,j*mapSize,mapSize,mapSize,(i+j)%2?'black':'white');
			}
		}

		// snake
		var snakeSize = conf.snake.size;
		render.rect(sn.head.x*snakeSize,sn.head.y*snakeSize,snakeSize,snakeSize,'red');
		sn.tails.forEach(function(tail){
			render.rect(tail.x*snakeSize,tail.y*snakeSize,snakeSize,snakeSize,'pink');
		});

		// fruit
		var fruitSize = conf.fruit.size;
		if(map.fruit){
			var fruit = map.fruit;
			render.rect(fruit.x*fruitSize,fruit.y*fruitSize,fruitSize,fruitSize,'green');
		}

	}.bind(game),17);

	game.start();




});
