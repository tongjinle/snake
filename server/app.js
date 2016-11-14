var server = require('http').createServer();
var io = require('socket.io')(server);


var chatList = [];

io.on('connection', function(client) {
	console.log('a user connect...');

	client.emit("enterroom",chatList);

	client.on('event', function(data) {
		console.log(data);
	});
	client.on('disconnect', function() {});



	client.on("chat",function(data){
		var content=[data.username,data.text].join(':');
		console.log(content);
		chatList.push(content);

		io.emit("chatmsg",content);
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