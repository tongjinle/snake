var server = require('http').createServer();
var io = require('socket.io')(server);
var Game = require('./Game');
var bindMgr = require('./bindMgr');
var conf = require('./config');

var game = new Game();

// add AI snake 
game.addAI('==AI-1==');
var toJSON = {
	user: function(user) {
		return {
			name: user.name,
			ready: user.ready,
			isAI: user.isAI
		};
	},
	snake: function(sn) {
		return {
			head: sn.head,
			tails: sn.tails,
			direction: sn.direction,
			speed: sn.speed,
			isAlive:sn.isAlive
		};
	}
};

io.on('connection', function(client) {

	console.log('someone connect');

	client.emit('user.preview', {
		userList: game.userList.map(toJSON.user),
		isRunning: game.isRunning
	});

	console.log('after emit preview');


	// 玩家登陆
	bindMgr.listen(client, 'user.connection', 'user.login', function() {
		console.log('bind user.login');

		client.on('user.login', function(data) {
			var username = data.username;
			console.log(username + ' try login ...');
			var isExist = function(user) {
				return user.name == username;
			};
			var canJoin = game.canJoin(username);
			if (canJoin) {
				client.username = username;
				game.joinUser(username);
				io.emit('toAll.user.login', {
					username: username,
					status: false
				});
				bindMgr.trigger(client, 'user.login');
			}
			client.emit('user.login', {
				flag: canJoin
			});
		});
	});

	// 玩家设置准备
	bindMgr.listen(client, 'user.login', 'user.gameStart', function() {
		console.log('bind user.ready');
		client.on("user.ready", function(data) {
			console.log('enter user.ready');
			var username = data.username;
			var isReady = data.isReady;
			game.readyUser(username, isReady);

			var user = game.userList.find(function(user) {
				return user.name == username;
			});
			var flag = !user || user.status != isReady;

			client.emit('user.ready', {
				flag: flag
			});
			if (flag) {
				var username = user.name;
				var status = user.ready;

				io.emit('toAll.user.ready', {
					username: username,
					status: status
				});
			}
			console.log(game.isRunning);
			if (game.isRunning) {
				// 通知游戏开始
				io.emit('toAll.user.gameStart');
				bindMgr.trigger(client, "user.gameStart");
			}
		});
	});

	
	// 定时发送游戏信息
	var t;
	bindMgr.listen(client, 'user.gameStart', 'user.gameOver', function() {
		// 发送基本游戏信息
		var info = {
			map: {
				width: game.map.width,
				height: game.map.height
			}
		};
		io.emit('toAll.user.basicGameinfo', info);
		console.log('basicGameinfo ==> ',info);


		t = setInterval(function() {
			if (!game.isRunning) {
				bindMgr.trigger(client, 'user.gameOver');
			}
			var info = getGameinfo(game);
			// console.log('gameinfo  ==> ',info);
			io.emit('toAll.user.gameinfo', {
				info: info
			});
		}, 50);


		function getGameinfo(game) {
			var snakeList = game.userList.map(function(user) {
				return user.sn;
			});

			return {
				snakeList: snakeList.map(toJSON.snake),
				fruit: game.map.fruit
			};
		}
	});


	// 接受来自玩家的操作信息
	bindMgr.listen(client, 'user.gameStart', 'user.gameOver', function() {
		client.on('user.action',function(data){
			var dire = conf.snake.directions[data.direction];
			var user = game.userList.find(function(user){return user.name == client.username;});
			user.sn.turn(dire);
		});
	});



	// 通知游戏结束
	bindMgr.listen(client, 'user.gameOver', 'user.gameOver', function() {
		console.log('=============clearInterval==============')
		clearInterval(t);
		io.emit('toAll.user.gameOver', game.winner);
	});

	bindMgr.listen(client, 'user.connection', 'user.disconnect', function() {
		client.on('disconnect', function() {
			var username = client.username;
			console.log(username);
			if (username) {
				game.quitUser(username);
				io.emit('toAll.user.disconnect', {
					username: username
				});
			}

			bindMgr.trigger(client, 'user.disconnect');
		});
	});


	// 广播
	bindMgr.trigger(client, 'user.connection');


});
server.listen(3000, () => {
	console.log('');
	console.log('');
	console.log('');
	console.log('');
	console.log('==========================================');
	console.log('server start');
	console.log(new Date().toLocaleString());
	console.log('==========================================');
});