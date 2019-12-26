const { isEmpty, isNil } = require('lodash');

class FreeFormMultiMessageManager {
	constructor(message, channel) {
		this.message = message;
		this.channel = channel;
	}

	messageUsers(reply, userList) {
		const messageChanel = this.channel;
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

module.exports = FreeFormMultiMessageManager;
