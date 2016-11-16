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
				currClient.on(status,callback);
			}else if(n.unbindStatus == status){
				currClient.off(status,callback);
			}
		});
	}
};

module.exports = bindMgr;