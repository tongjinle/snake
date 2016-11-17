var socket = io('http://127.0.0.1:3000');

var glob = {
	me:null,
	userList : [],
	isRunning:false
};

$(function(){
	$('#join').click(function(){
		var username = $('input').val();

		socket.emit("user.login",{username:username});
		glob.me = username;
	});

	$('#ready').click(function(){
		var me = glob.userList.find(function(user){return user.name == glob.me;});
		var status = !me.status;
		if(me){
			socket.emit('user.ready',{
				username:me.name,
				isReady:status
			});
		}else{
			alert("join first !!");
		}
	});

	$('#back').click(function(){

	});

	socket.on('user.preview',function(data){
		glob.userList = data.userList.map(function(user){
			return {
				name:user.name,
				status:user.ready
			};
		});
		glob.isRunning = data.isRunning;

		renderUserList();
	});


	socket.on('user.login',function(data){
		console.log(data);
		if(!data.flag){
			alert('login fail ... ');
		}
	});

	socket.on('toAll.user.login',function(data){
		var username = data.username;
		var status = data.status;

		glob.userList.push({
			name:username,
			status:status
		});

		renderUserList();
	});


	socket.on('user.ready',function (data) {
		var flag = data.flag;

		if(!flag){
			alert('set status fail');
		}

	});


	socket.on('toAll.user.ready',function (data) {
		var username = data.username;
		var status = data.status;

		var user = glob.userList.find(function(user){return user.name == username;});
		user.status = status;
		renderUserList();

	});


	socket.on('toAll.user.gameStart',function(){
		$('#login').slideUp();
		$('#game').slideDown();

	});


	socket.on('toAll.user.gameinfo',function(data){
		var snakeList = data.info;

		console.log(snakeList);
	});


	socket.on('toAll.user.disconnect',function(data){
		console.log(123);
		var username = data.username;
		glob.userList = glob.userList.filter(function(user){return user.name != username;});

		renderUserList();
	});


});

function renderUserList(){
	var $userList = $('#userList');
		$userList.empty();

	glob.userList.forEach(function(user){
		var $row = $('<div/>').addClass('row');
		$row.append('<div class="username">'+user.name+'</div>');
		$row.append('<div class="status '+(user.status ? 'active' : '')+'">'+(user.status?'已准备':'未准备')+'</div>');
		$userList.append($row);
	});
}