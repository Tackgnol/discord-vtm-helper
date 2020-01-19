const AmbianceManager = require('../../EventManagers/AmbianceManager');

const settings = require('../../../config/settings');

class AmbianceHandler {
	constructor(filePath, dispatcher, command) {
		this.filePath = filePath;
		this.dispatcher = dispatcher;
		this.command = command;
	}

	handle() {
		const manager = new AmbianceManager(this.filePath, this.dispatcher);
		switch (this.command) {
		case settings.soundCommands.playTrack:
			manager.playAmbiance();
			break;
		case settings.soundCommands.playSound:
			manager.playSound();
			break;
		case settings.soundCommands.stop:
			manager.stop();
			break;
		default:
			manager.stop();
		}
	}
}

module.exports = AmbianceHandler;
