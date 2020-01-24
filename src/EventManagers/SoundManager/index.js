const { Play, Stop } = require('../../Common/Play');

class SoundManager {
	constructor(filePath, dispatcher) {
		this.filePath = filePath;
		this.dispatcher = dispatcher;
	}

	playAmbiance(filePath) {
		this.filePath = filePath;
		const player = Play(this.dispatcher, this.filePath)
		player && player.on('end', () => {
			Play(this.dispatcher, this.filePath);
		});
	}

	playSound(filePath) {
		const player = Play(this.dispatcher, filePath);
		player && player.on('end', () => {
			Play(this.dispatcher, this.filePath);
		});
	}

	stop() {
		Stop(this.dispatcher);
	}
}

module.exports = SoundManager;
