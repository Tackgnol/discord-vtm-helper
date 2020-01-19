const { isNil } = require('lodash');

class AmbianceManager {
	constructor(filePath, dispatcher) {
		this.filePath = filePath;
		this.dispatcher = dispatcher;
	}

	playAmbiance() {

		if(!isNil(this.dispatcher.dispatcher)) {
			this.dispatcher.dispatcher.player.voiceConnection.playArbitraryInput(this.filePath).on('error', e=> {
				console.log(e);
			});
		} else {
			const player = this.dispatcher.playFile(this.filePath).on('error', e=> {
				console.log(e);
			});
			player.setVolume(1);
			player.resume();
		}
	}

	playSound() {
		if(!isNil(this.dispatcher.dispatcher)) {
			const file = this.dispatcher.dispatcher.player.currentStream.input.replace('file:', '');
			this.dispatcher.dispatcher.player.voiceConnection.playArbitraryInput(this.filePath).on('end', () => {
				console.log(file);
				this.dispatcher.playFile(file, { volume:1 });
			}).on('debug', e=> {
				console.log(e);
			});

		} else {
			const player = this.dispatcher.playFile(this.filePath).on('debug', e=> {
				console.log(e);
			});
			player.setVolume(1);
			player.resume();
		}
	}

	stop() {
		if(!isNil(this.dispatcher.dispatcher)) {
			this.dispatcher.dispatcher.end('Stopped by API');
		}
	}
}

module.exports = AmbianceManager;
