const { isNil } = require('lodash');

const MessageMultiplePlayersManager = require('../../EventManagers/FreeFormMultiMessageManager');

class FreeFormMessageMultiplePlayersHandler {
	constructor(message, userList, channelId, client) {
		this.message = message;
		this.userList = userList
		const channel = !isNil(client) ? client.channels.find(c => channelId === c.id) : message.channel;
		this.manager = new MessageMultiplePlayersManager(message, channel);
	}

	handle() {
		if (!isNil(this.message)) {
			this.manager.messageUsers(this.message, this.userList);
		}
	}
}

module.exports = FreeFormMessageMultiplePlayersHandler;
