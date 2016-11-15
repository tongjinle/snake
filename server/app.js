var server = require('http').createServer();
var io = require('socket.io')(server);
var Game = require('./Game');

var game = new Game();

io.on('connection', function(client) {
	var canJoin = game.canJoin();

	var username;
	if(canJoin){
		username = "dino"+(+new Date);
	}

	client.emit('afterConnect', {
		flag: canJoin,
		username:username
	});

	if (!game.canJoin()) {
		return ;
	}

	game.joinUser(username);
	// 广播
	io.emit("user.connect",{username:username});

	// 玩家设置准备
	client.on("ready", function(data) {
		var username = data.username;
		var isReady = data.isReady;
		game.readyUser(username,isReady);

		if(game.isRunning){
			io.emit("user.gameStart");
		}
	});

	client.on('disconnect', function() {
		game.quitUser(username);
		io.emit('user.disconnect',{username:username});
	});


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