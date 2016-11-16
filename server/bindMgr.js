// 监听管理者
var bindMgr = {
	_list:[],
	listen: function (client,bindStatus,unbindStatus,callback){
		this._list.push({
			client:client,
			bindStatus:bindStatus,
			unbindStatus:unbindStatus,
			callback:callback,
		});
	},
	trigger:function(client,status){
		this._list.forEach(function(n){
			var currClient = n.client;
			if(!currClient || currClient!=client){
				return;
			}

			if(n.bindStatus == status){
				// console.log('trigger '+status);
				n.callback();
			}else if(n.unbindStatus == status){
				currClient.off(status,n.callback);
			}
		});
	}
};

module.exports = bindMgr;