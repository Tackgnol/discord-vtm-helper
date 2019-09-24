const { isNil, get, find } = require('lodash');

const GlobalTestManager = require('../../EventManagers/GlobalTestManager');

class GlobalTestHandler {
	constructor(session, message, query) {
		this.sessionData = session;
		this.message = message;
		this.eventName = query.eventName;
		this.value = query.value;
		this.manager = new GlobalTestManager(message);
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
