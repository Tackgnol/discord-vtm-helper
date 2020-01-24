const { isNil, isArray } = require('lodash');

const MessageMultiplePlayersManager = require('../../EventManagers/FreeFormMultiMessageManager');

class FreeFormMessageMultiplePlayersHandler {
	constructor(message, userList, channel) {
		this.message = message;
		this.userList = isArray(userList) ? userList : [userList];
		this.manager = new MessageMultiplePlayersManager(message, channel);
	}

	handle() {
		if (!isNil(this.message)) {
			this.manager.messageUsers(this.message, this.userList);
		}
	}
}

module.exports = FreeFormMessageMultiplePlayersHandler;
