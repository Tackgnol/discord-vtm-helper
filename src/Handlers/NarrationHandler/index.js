const { isNil, get, find } = require('lodash');

const NarrationManager = require('../../EventManagers/NarrationManager');

class NarrationHandler {
	constructor(session, message, query, channelId, client = null) {
		this.sessionData = session;
		this.message = message;
		this.eventName = query.eventName;
		this.value = query.value;
		const channel = !isNil(client) ? client.channels.find(c => channelId === c.id) : message.channel;
		this.manager = new NarrationManager(message, channel);
	}

	handle() {
		const currentSession = get(this.sessionData, 'narration');
		const narrationPiece = find(currentSession, c => c.name === this.eventName);
		if (!isNil(narrationPiece)) {
			const {
				narrationText, image,
			} = narrationPiece;
			this.manager.displayNarration(narrationText, image);
		}
	}
}

module.exports = NarrationHandler;
