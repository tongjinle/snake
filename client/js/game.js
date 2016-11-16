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
		if(me){
			socket.emit('user.ready',{
				username:me.name,
				isReady:me.status
			});
		}else{
			alert("join first !!");
		}
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
		if(data.flag){
			glob.userList.push({
				name:glob.me,
				status:false
			});

			renderUserList();
		}
	});


});

function renderUserList(){
	var $userList = $('#userList');
		$userList.empty();

	glob.userList.forEach(function(user){
		$userList.append('<div class="username">'+user.name+'</div>');
		$userList.append('<div class="status '+(user.status ? 'active' : '')+'">'+(user.status?'已准备':'未准备')+'</div>');
	});
}