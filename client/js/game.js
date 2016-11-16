var socket = io('http://127.0.0.1:3000');

var glob = {
	userList : [],
	isRunning:false
};

$(function(){
	$('#join').click(function(){
		var username = $('input').val();

		socket.emit("user.login",{username:username})
	});

	$('#back').click(function(){

	});

	socket.on('user.preview',function(data){
		glob.userList = data.userList;
		glob.isRunning = data.isRunning;

		renderUserList();
	});


	socket.on('user.login',function(data){
		console.log(data);
	});


});

function renderUserList(){
	var $userList = $('#userList');
		$userList.empty();

	data.userList.forEach(function(user){
		$userList.append('<div class="username">'+user.name+'</div>');
		$userList.append('<div class="status '+(user.status ? 'active' : '')+'">'+(user.status?'已准备':'未准备')+'</div>');
	});
}