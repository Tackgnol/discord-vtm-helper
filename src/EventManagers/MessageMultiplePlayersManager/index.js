const { isEmpty, isNil } = require('lodash');

class MessageMultiplePlayers {
	constructor(message) {
		this.message = message;
		this.client = message.client;
	}

	messageUsers(reply, userList) {
		const messageChanel = this.message.channel;
		if (messageChanel.type === 'text') {
			const channelMembers = messageChanel.members;
			if (!isEmpty(userList)) {
				userList.forEach(u => {
					const foundUser = channelMembers.find(val => val.user.username === u);
					if (!isNil(foundUser)) {
						foundUser.send(reply);
					}
				});
			}
		}
	}
}

module.exports = MessageMultiplePlayers;
