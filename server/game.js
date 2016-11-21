var conf = require('./config');
var Snake = require('./snake');
var GameMap = require('./map');

var frames = 60;
var interval = 1000 / frames;
var lastTs = null;
var tick = 0;


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
		var user = {
			name: username,
			sn: sn,
			ready: false
		};
		userList.push(user);
		return user;
	},

	addAI:function(ainame){
		var user = this.joinUser(ainame);
		user.isAI = true;
		user.ready = true;
		user.sn.speed = conf.snake.aiSpeed;
		// console.log(user);
		return user;
	},

	quitUser: function(username) {
		this.userList = this.userList.filter(function(user){
			return user.name != username;
		});

		this._tryStop();
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
	_tryStop:function(){
		if(this.userList.length<=conf.user.stopCount){
			this.stop();
		}

		var aliveUserCount = this.userList.filter(function(user){return user.sn.isAlive;}).length;
		console.log(aliveUserCount,conf.user.stopCount);
		if(aliveUserCount == conf.user.stopCount){
			this.stop();
		}
	},
	_createSnake: function() {
		var sn;
		var margin =4;
		while (1) {
			var x = margin+Math.floor(Math.random() * (this.map.width-margin));
			var y = margin +Math.floor(Math.random() * (this.map.height-margin));
			isExist = this.userList.find(function(user) {
				return user.sn.head.x == x && user.sn.head.y == y;
			});
			if (!isExist) {
				sn = new Snake(x, y);
				sn.setGame(this);
				break;
			}
		}
		return sn;
	},

	start: function() {
		this.isRunning =true;

		// 绑snake的运动
		this.schedule(function () {
			this.userList.forEach(function(user){
				var sn = user.sn;
				if(sn.isAlive){
					if(user.isAI){
						sn.ai();
					}
					sn.moveByTime(50);
				}
			});
		}.bind(this),50);

		// 绑定createFruit
		this.schedule(function(){
			this.map.createFruit();
		}.bind(this),conf.map.createInterval);

		lastTs = +new Date;
		this._timer = setInterval(function() {
			var currTs = +new Date;
			var dt = currTs - lastTs;
			lastTs = currTs;
			this.update(dt);
		}.bind(this), interval);
	},

	stop:function(){
		this.isRunning = false;
		// 停止下面所有snake的动作
		console.log(this.userList.map(function(user){
			return require('./toJSON').user(user);
		}));
		this.winner = this.userList.find(function(user){
			return user.sn.isAlive;
		}).name;
		// 清理userList,所有非AI玩家的状态设置成false（未准备）
		this.userList = this.userList.map(function(user){
			user.sn = this._createSnake();
			if(user.isAI){
				user.sn.speed = conf.snake.aiSpeed;
				user.ready = true;
			}else{
				user.sn.speed = conf.snake.speed;
				user.ready = false;
			}
			return user;
		}.bind(this));
		// 清理schedule
		this._list = [];
		clearInterval(this._timer);
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
	unbind: function() {
		this._list.length = 0;
		console.log('game is over');
	},
	// game接受子级元素的ask
	// 中介作用
	ask:function(ques){
		var args = [].slice.call(arguments,1);
		if(!askDict[ques]){
			throw 'no such question~';
		}
		return askDict[ques].apply(this,args);
	},
	map: null,
	_list: [],
	// 是否游戏已经开始
	isRunning: false
};

var askDict = {
	'#getSpaceCountByDirection':function(posi,dire){
		var directions = conf.snake.directions;
		var x = posi.x;
		var y = posi.y;

		var count = 0;
		var step = 1;
		var nextPosi;
		while(1)
		{
			if (dire == directions.up) {
				y-=step;
			}else if(dire == directions.right){
				x+=step;
			}else if(dire == directions.down){
				y+=step;
			}else if(dire == directions.left){
				x-=step;
			}
			
			nextPosi = {x:x,y:y};

			
			// console.log('isOutOfMap.........');
			// console.log(dire,nextPosi,this.ask('#isOutOfMap',nextPosi));
			if(this.ask('#isOutOfMap',nextPosi)){
				break;
			}
			
			if(this.ask('#isBodyOfSnake',nextPosi)){
				break;
			}

			count++;
		}

		return count;
	},
	// 是否超过地图边界
	'#isOutOfMap':function(posi){
		var x = posi.x;
		var y = posi.y;
		return x < 0 || x >= this.map.width || y < 0 || y >= this.map.height;
	},
	// 是否是snake的坐标
	'#isBodyOfSnake':function(posi){
		var x = posi.x;
		var y = posi.y;
		return !!this.userList.find(function(user){
			var sn = user.sn;
			var posiList = [sn.head].concat(sn.tails);
			return !!posiList.find(function(posi){
				return posi.x == x && posi.y == y;
			});
		});
	},
	'#isOtherSnake':function(snake,posi){
		var x = posi.x;
		var y = posi.y;
		var flag = !!this.userList.find(function(user){
			var sn = user.sn;
			if(sn == snake){
				return false;
			}
			if(sn.isAlive){
				var posiList = [sn.head].concat(sn.tails);
				return !!posiList.find(function(posi){
					return posi.x == x && posi.y == y;
				});
			}

		});
		if(flag){
			console.log('isOtherSnake!');
		}
		return flag;
	},
	// 是否是水果的坐标
	'#isFruit':function(posi){
		return this.map.fruit && posi.x == this.map.fruit.x && posi.y == this.map.fruit.y;
	},
	'#eatFruit':function(){
		this.map.fruit = null;
	},
	'#snakeDie':function(){
		console.log('snake die...');
		this._tryStop();

	}
};

var __ = function() {};
__.prototype = game;

var Game = function() {
	this.init();
	// add AI snake 
	// this.addAI('==AI-1==');
};
Game.prototype = new __();

module.exports = Game;