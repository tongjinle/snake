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