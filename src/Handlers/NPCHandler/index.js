
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
		if(this.eventName === settings.subPrefixes.npcsSubCommands.all) {
			this.manager.allNPCs(this.sessionData);
		} else {
			this.manager.oneNPC(this.sessionData, this.eventName);
		}
	}
}

module.exports = NPCHandler;
