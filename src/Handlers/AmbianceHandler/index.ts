import AmbianceManager from '../../EventManagers/SoundManager';
import { settings } from '../../config/settings';
import { VoiceConnection } from 'discord.js';

class AmbianceHandler {
	constructor(private filePath: string, private dispatcher: VoiceConnection, private command: string) {
		this.filePath = filePath;
		this.dispatcher = dispatcher;
		this.command = command;
	}

	handle() {
		const manager = new AmbianceManager(this.filePath, this.dispatcher);
		switch (this.command) {
			case settings.soundCommands.playTrack:
				manager.playAmbiance(this.command);
				break;
			case settings.soundCommands.playSound:
				manager.playSound(this.command);
				break;
			case settings.soundCommands.stop:
				manager.stop();
				break;
			default:
				manager.stop();
		}
	}
}

export default AmbianceHandler;
