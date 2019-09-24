const { isNil, get, find } = require('lodash');

const MultiMessageManager = require('../../EventManagers/MultiMessageManager');

class MultiMessageHandler {
	constructor(session, message, query) {
		this.sessionData = session;
		this.message = message;
		this.eventName = query.eventName;
		this.value = query.value;
		this.manager = new MultiMessageManager(message);
	}

	handle() {
		console.log(this.sessionData);
		const currentSession = get(this.sessionData, 'multiMessage');
		const displayTest = find(currentSession, c => c.name === this.eventName);
		if (!isNil(displayTest)) {
			const { messageObject } = displayTest;
			this.manager.messageUsers(messageObject);
		}
	}
}

module.exports = MultiMessageHandler;
