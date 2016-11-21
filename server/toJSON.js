var toJSON = {
	user: function(user) {
		return {
			name: user.name,
			ready: user.ready,
			isAI: user.isAI
		};
	},
	snake: function(sn) {
		return {
			head: sn.head,
			tails: sn.tails,
			direction: sn.direction,
			speed: sn.speed,
			isAlive:sn.isAlive
		};
	}
};

module.exports = toJSON;