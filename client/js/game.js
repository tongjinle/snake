var socket = io('http://10.21.106.102:3000');

var glob = {
	me: null,
	userList: [],
	isRunning: false
};

var render;

$(function() {
	$('input').val('aaa');


	$('#join').click(function() {
		var username = $('input').val();

		socket.emit("user.login", {
			username: username
		});
		glob.me = username;
	});

	$('#ready').click(function() {
		var me = glob.userList.find(function(user) {
			return user.name == glob.me;
		});
		var status = !me.status;
		if (me) {
			socket.emit('user.ready', {
				username: me.name,
				isReady: status
			});
		} else {
			alert("join first !!");
		}
	});

	$('#back').click(function() {
		$('#login').slideDown();
		$('#game').slideUp();
	});

	socket.on('user.preview', function(data) {
		glob.userList = data.userList.map(function(user) {
			return {
				name: user.name,
				status: user.ready
			};
		});
		glob.isRunning = data.isRunning;

		renderUserList(glob.userList);
	});


	socket.on('user.login', function(data) {
		console.log(data);
		if (!data.flag) {
			alert('login fail ... ');
		}
	});

	socket.on('toAll.user.login', function(data) {
		var username = data.username;
		var status = data.status;

		glob.userList.push({
			name: username,
			status: status
		});

		renderUserList(glob.userList);
	});


	socket.on('user.ready', function(data) {
		var flag = data.flag;

		if (!flag) {
			alert('set status fail');
		}

	});


	socket.on('toAll.user.ready', function(data) {
		var username = data.username;
		var status = data.status;

		var user = glob.userList.find(function(user) {
			return user.name == username;
		});
		user.status = status;
		renderUserList(glob.userList);

	});


	socket.on('toAll.user.gameStart', function() {
		$('#login').slideUp();
		$('#game').slideDown();

	});

	socket.on('toAll.user.basicGameinfo', function(data) {

		var map = data.map;
		glob.gameInfo ={map:map};

		var $canvas = $('#game canvas');
		$canvas.attr({
			width:map.width * conf.map.size,
			height:map.height * conf.map.size
		});
		var c = $canvas[0];
		var ctx = c.getContext("2d");

		render = new Render(ctx, map.width, map.height);
	});


	socket.on('toAll.user.gameinfo', function(data) {
		var info = data.info;
		info.map = glob.gameInfo.map;
		info.snakeList = info.userList.map(function(user){
			var username = user.username;
			var sn = user.sn;
			sn.color = sn.tailColor = username == glob.me ? 'steelblue' : 'orange';
			return sn;
		});
		render.renderGame(info);
	});

	socket.on('toAll.user.gameOver',function(data){
		var winner = data.winner;
		setTimeout(function(){
			if(winner == glob.me){
				alert('you win !!')
			}else{
				alert('you lose ... the winner is '+winner);
			}

		},500);
	});

	socket.on('toAll.user.gameRestart',function(data){
		glob.userList = data.userList.map(function(user){
			user.status = user.ready;
			return user;
		});
		glob.isRunning = false;
		renderUserList(glob.userList);
	});


	socket.on('toAll.user.disconnect', function(data) {
		var username = data.username;
		glob.userList = glob.userList.filter(function(user) {
			return user.name != username;
		});

		renderUserList(glob.userList);
	});

	listen();


	function listen(){
		$(window).on('keypress',function(e){
			var keyCode = e.keyCode;
			var flag = false;
			for(var i in conf.keys){
				if(conf.keys[i] == keyCode){
					flag = true;
					socket.emit('user.action',{direction:i});
					break;
				}
			}
		})
	}
});

// 因为是jquery的dom操作,因此不放在render.js中
function renderUserList(userList) {
	var $userList = $('#userList');
	$userList.empty();

	userList.forEach(function(user) {
		var $row = $('<div/>').addClass('row');
		$row.append('<div class="username">' + user.name + '</div>');
		$row.append('<div class="status ' + (user.status ? 'active' : '') + '">' + (user.status ? '已准备' : '未准备') + '</div>');
		$userList.append($row);
	});
};