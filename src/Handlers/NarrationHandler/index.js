const { isNil, get, find } = require('lodash');

const NarrationManager = require('../../EventManagers/NarrationManager');

class NarrationHandler {
	constructor(session, message, query) {
		this.sessionData = session;
		this.message = message;
		this.eventName = query.eventName;
		this.value = query.value;
		this.manager = new NarrationManager(message);
	}

	handle() {
		const currentSession = get(this.sessionData, 'narration');
        const narrationPiece = find(currentSession, c => c.name === this.eventName);
		if (!isNil(narrationPiece)) {
			const {
				narrationText, image
			} = narrationPiece;
		this.manager.displayNarration(narrationText, image)
		}
	}
}

module.exports = NarrationHandler;
