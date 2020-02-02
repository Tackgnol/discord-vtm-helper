const { isNil, get, find } = require('lodash');

const GlobalTestManager = require('../../EventManagers/GlobalTestManager');

class GlobalTestHandler {
	constructor(session, message, query, channel) {
		this.sessionData = session;
		this.message = message;
		this.eventName = query.eventName;
		this.value = query.value;
		this.manager = new GlobalTestManager(message, channel);
	}

	handle() {
		const currentSession = get(this.sessionData, 'globaltestSet');
		const displayTest = find(currentSession, c => c.name === this.eventName);
		if (!isNil(displayTest)) {
			const {
				testMessage,
				replyPrefix,
				shortCircuit,
				globaltestoptionSet,
			} = displayTest;
			this.manager.performTest(
				testMessage,
				replyPrefix,
				globaltestoptionSet,
				shortCircuit,
				this.value
			);
		}
	}
}

module.exports = GlobalTestHandler;
