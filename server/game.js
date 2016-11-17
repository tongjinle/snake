// 60 frames
// 16.6ms

var conf = require('./config');
var Snake = require('./snake');
var GameMap = require('./map');

var frames = 60;
var interval = 1000 / frames;
var lastTs = null;
var tick = 0;

var map

var sn;
var map;
var render;



var game = {
	canJoin: function(username) {
		var userList = this.userList;
		var isExist = function(user){return user.name == username;};
		return userList.length < conf.user.maxCount && !this.isRunning && !userList.find(isExist);
	},

	joinUser: function(username) {
		var userList = this.userList;

		var sn = this._createSnake();
		userList.push({
			name: username,
			sn: sn,
			ready: false
		});
	},
	quitUser: function(username) {
		this.userList = this.userList.filter(function(user){
			return user.name != username;
		});
	},
	readyUser: function(username, ready) {
		var user = this.userList.find(function(user) {
			return user.name == username;
		});
		user.ready = ready;

		// 是否开始游戏
		this._tryStart();


	},
	_tryStart: function() {
		// 用户人数满足 && 用户都已经准备完毕
		if (this.userList.length >= conf.user.minCount && !this.userList.filter(function(user) {
				return !user.ready;
			}).length) {
			this.start();
		}
	},
	_createSnake: function() {
		var sn ;
		while (1) {
			var x = Math.floor(Math.random() * this.map.width);
			var y = Math.floor(Math.random() * this.map.height);
			isExist = this.userList.find(function(user) {
				return user.sn.head.x == x && user.sn.head.y == y;
			});
			if (!isExist) {
				sn = new Snake(x, y);
				sn.setMap(map);
				break;
			}
		}
		return sn;
	},

	start: function() {
		this.isRunning =true;

		this.listen();

		lastTs = +new Date;
		this._timer = setInterval(function() {
			var currTs = +new Date;
			var dt = currTs - lastTs;
			lastTs = currTs;
			this.update(dt);
		}.bind(this), interval);
	},
	init: function() {
		this.userList = [];
		this.isRunning = false;

		this._list = [];
		this.map = new GameMap(conf.map.size, conf.map.size);
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
		// $(window).bind('keypress', function(e) {
		// 	var keyCode = e.keyCode;
		// 	var keys = conf.keys;
		// 	if (keyCode == keys.up) {
		// 		sn.turn(conf.snake.directions.up);
		// 	} else if (keyCode == keys.right) {
		// 		sn.turn(conf.snake.directions.right);

		// 	} else if (keyCode == keys.down) {
		// 		sn.turn(conf.snake.directions.down);

		// 	} else if (keyCode == keys.left) {
		// 		sn.turn(conf.snake.directions.left);
		// 	}
		// });
	},
	unbind: function() {
		this._list.length = 0;
		console.log('game is over');
	},
	map: null,
	_list: [],
	// 是否游戏已经开始
	isRunning: false
};

var __ = function() {};
__.prototype = game;

var Game = function() {
	this.init();
};
Game.prototype = new __();

module.exports = Game;