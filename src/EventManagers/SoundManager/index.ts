import { Play, Stop } from '../../Common/Play';
import { VoiceConnection } from 'discord.js';

class SoundManager {
	constructor(private filePath: string, private dispatcher: VoiceConnection) {
		this.filePath = filePath;
		this.dispatcher = dispatcher;
	}

	playAmbiance(filePath: string) {
		this.filePath = filePath;
		const player = Play(this.dispatcher, this.filePath);
		player &&
			player.on('end', () => {
				Play(this.dispatcher, this.filePath);
			});
	}

	playSound(filePath: string) {
		const player = Play(this.dispatcher, filePath);
		player &&
			player.on('end', () => {
				Play(this.dispatcher, this.filePath);
			});
	}

	stop() {
		Stop(this.dispatcher);
	}
}

export default SoundManager;
