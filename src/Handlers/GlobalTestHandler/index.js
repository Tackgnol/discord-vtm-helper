const SessionData = require('../../Resources/events/Session-Dev');

class GlobalTestHandler {
	constructor(session, message) {
		this.sessionData = SessionData[session];
		this.message = message;
	}
}

module.exports = GlobalTestHandler;
