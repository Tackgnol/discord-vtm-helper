const { isNil, get, find } = require('lodash');
const NPCManager = require('../../EventManagers/NPCManager');
const settings = require('../../../config/settings');
class NPCHandler {
	constructor(session, message, query) {
		this.sessionData = session;
		this.message = message;
		this.eventName = query.eventName;
		this.value = query.value;
		this.manager = new NPCManager(message);
	}

	handle() {
		const currentSession = get(this.sessionData, 'data.player');
		if(this.eventName === settings.subPrefixes.npcsSubCommands.all) {
			this.manager.allNPCs(currentSession.filteredFacts);
		} else {
			this.manager.oneNPC(currentSession.filteredFacts, this.eventName);
		}
		// const displayTest = find(currentSession, c => c.name === this.eventName);
		// if (!isNil(displayTest)) {
		// 	const { statName, minValue, successMessage } = displayTest;
		// 	this.manager.checkStat(statName, minValue, successMessage);
		// }
	}
}

module.exports = NPCHandler;
