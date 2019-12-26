const { isNil, get, find } = require('lodash');

const GlobalTestManager = require('../../EventManagers/GlobalTestManager');

class GlobalTestHandler {
	constructor(session, message, query, channelId, client = null) {
		this.sessionData = session;
		this.message = message;
		this.eventName = query.eventName;
		this.value = query.value;
		const channel = !isNil(client) ? client.channels.find(c => channelId === c.id) : message.channel;
		this.manager = new GlobalTestManager(message, channel);
	}

	handle() {
		const currentSession = get(this.sessionData, 'globalTests');
		const displayTest = find(currentSession, c => c.name === this.eventName);
		if (!isNil(displayTest)) {
			const {
				testMessage,
				replyPrefix,
				shortCircut,
				optionArray,
			} = displayTest;
			this.manager.performTest(
				testMessage,
				replyPrefix,
				optionArray,
				shortCircut,
				this.value
			);
		}
	}
}

module.exports = GlobalTestHandler;
