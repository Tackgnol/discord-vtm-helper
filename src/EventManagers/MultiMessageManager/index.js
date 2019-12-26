const { isEmpty, isNil } = require('lodash');

class MultiMessageManager {
	constructor(message, client = null) {
		if(isNil(message.client)) {
			this.message = message;
			this.client = client;
		} else {
			this.message = message;
			this.client = message.client;
		}
	}

	messageUsers(messageObject) {
		if (isEmpty(messageObject)) return;
		const messageChanel = this.message.channel;
		if (messageChanel.type === 'text') {
			messageObject.forEach(m => {
				const channelMembers = messageChanel.members;
				const userList = m.userList;
				if (!isEmpty(userList)) {
					userList.forEach(u => {
						const foundUser = channelMembers.find(
							val => val.user.username === u
						);
						if (!isNil(foundUser)) {
							foundUser.send(m.value);
						}
					});
				}
			});
		}
	}
}

module.exports = MultiMessageManager;
