var server = require('http').createServer();
var io = require('socket.io')(server);
var Game = require('./Game');
var bindMgr = require('./bindMgr');

var game = new Game();

io.on('connection', function(client) {
	console.log('');
	console.log('');
	console.log('');
	console.log('');
	console.log('==========================================');
	console.log('someone connect');
	console.log('==========================================');

	client.emit('user.preview', {
		userList:game.userList,
		isRunning:game.isRunning
	});

	
	
	// 玩家登陆
	bindMgr.listen(client,'user.connection','user.login',function(){
		console.log('bind user.login');

		client.on('user.login',function(data){
			var username = data.username;
			console.log(username+' try login ...');
			var isExist = function(user){return user.name == username;};
			var canJoin = game.canJoin();
			if(canJoin){
				game.joinUser(username);
				console.log(game.userList);
				io.emit('toAll.user.login',{username:username});
				// bindMgr.trigger(client,'user.login');
			}
			client.emit('user.login',{flag:canJoin});
		});
	});

	// 玩家设置准备
	bindMgr.listen(client,'user.login','user.gameStart',function(){
		client.on("user.ready", function(data) {
			var username = data.username;
			var isReady = data.isReady;
			game.readyUser(username,isReady);

			if(game.isRunning){
				// 通知游戏开始
				io.emit("user.gameStart");
				// bindMgr.trigger(client,"user.gameStart");
			}
		});
	});

	// 定时发送游戏信息
	var t;
	bindMgr.listen(client,'user.gameStart','user.gameOver',function(){
		var t = setInterval(function(){
			if(!game.isRunning){
				bindMgr.trigger(client,'user.gameOver');
			}
			var info =getGameinfo(game);
			io.emit('user.gameinfo',info);
		},100);

		function getGameinfo(game){
			return game.userList.map(function(user){
				return user.snake;
			});
		}
	});



	// 通知游戏结束
	bindMgr.listen(client,'user.gameOver','user.gameOver',function(){
		clearInterval(t);
		io.emit('user.gameOver',game.winner);
	});

	bindMgr.listen(client,'user.connection','user.disconnect',function(){
		client.on('disconnect', function() {
			game.quitUser(username);
			io.emit('user.disconnect',{username:username});

			bindMgr.trigger(client,'user.disconnect');
		});
	});


	// 广播
	// io.emit("user.connect");
	bindMgr.trigger(client,'user.connection');


});
server.listen(3000, () => console.log('server start'));



// var io = require('socket.io')();
// io.on('connection', function(client){
// 	console.log('io is runing');
// 	client.on('event', function(data) {});
// 	client.on('disconnect', function() {});
// });
// io.listen(3000,function(){
// 	console.log('io is runing');
// });


// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);

// app.get('/', function(req, res){
//   res.sendfile('index.html');
// });

// io.on('connection', function(socket){
//   console.log('a user connected');
// });

// http.listen(3000, function(){
//   console.log('listening on *:3000');
// });