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
	canJoin:function(){
		return true;
	},

	joinUser:function(username){
		var userList = this.userList = this.userList ||[];

		var sn = this._createSnake();
		userList.push({
			name:username,
			sn:sn,
			ready
		})
	},
	quitUser:function(username){
		
	},
	readyUser:function(username,ready){
		var user = this.userList.find(function(user){return user.name == username;});
		user.ready = ready;

		// 是否开始游戏
	},
	_createSnake:function(){
		
	},

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
		map = new GameMap(conf.map.size,conf.map.size);;

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
	unbind: function() {
		this._list.length = 0;
		console.log('game is over');
	},
	_list: []
};

var __ = function(){};
__.prototype = game;

var Game = function(){};
Game.prototype = new __();

module.exports =Game;