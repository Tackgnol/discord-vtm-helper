const { isNil, get, find } = require('lodash');

const MessageMultiplePlayersManager = require('../../EventManagers/MessageMultiplePlayersManager');

class MessageMultiplePlayersHandler {
	constructor(session, message, query) {
		this.sessionData = session;
		this.message = message;
		this.eventName = query.eventName;
		this.value = query.value;
		this.manager = new MessageMultiplePlayersManager(message);
	}

	handle() {
		const currentSession = get(this.sessionData, 'messageMultiplePlayers');
		const displayTest = find(currentSession, c => c.name === this.eventName);
		if (!isNil(displayTest)) {
			const { userList, value } = displayTest;
			this.manager.messageUsers(value, userList);
		}
	}
}

module.exports = MessageMultiplePlayersHandler;
