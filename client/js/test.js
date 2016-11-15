var socket = io('http://10.21.106.10:3000');

// io.on("connection", function(socket) {
// 	console.log('client connect..');
// });

var username = 'dino' + (+new Date);

$(function() {
	$('#send').click(function() {
		var text = $("input").val();
		socket.emit("chat", {
			username: username,
			text: text
		});
	});

	socket.on("chatmsg", function(data) {
		$('#content').append($('<div/>').text(data));
	});


	socket.on('enterroom', function(data) {
		data.forEach(function(n) {
			$('#content').append($('<div/>').text(n));

		});
	});

});

	// game.schedule(function(){
	// 	var render = this.render;
	// 	// clear
	// 	render.clear();
	// 	// map
	// 	var mapSize = conf.map.size;
	// 	for (var i = 0; i < map.width; i++) {
	// 		for (var j = 0; j < map.height; j++) {
	// 			render.rect(i*mapSize,j*mapSize,mapSize,mapSize,(i+j)%2?'black':'white');
	// 		}
	// 	}

	// 	// snake
	// 	var snakeSize = conf.snake.size;
	// 	render.rect(sn.head.x*snakeSize,sn.head.y*snakeSize,snakeSize,snakeSize,'red');
	// 	sn.tails.forEach(function(tail){
	// 		render.rect(tail.x*snakeSize,tail.y*snakeSize,snakeSize,snakeSize,'pink');
	// 	});

	// 	// fruit
	// 	var fruitSize = conf.fruit.size;
	// 	if(map.fruit){
	// 		var fruit = map.fruit;
	// 		render.rect(fruit.x*fruitSize,fruit.y*fruitSize,fruitSize,fruitSize,'green');
	// 	}

	// }.bind(game),17);