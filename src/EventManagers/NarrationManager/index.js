class NarrationManager {
	constructor(message, channel) {
		this.message = message;
		this.channel = channel;
	}

	displayNarration(narrationText, image = null) {
		const messageChanel = this.channel;
		messageChanel.send(`${narrationText} \n ${image}`);
	}

}

module.exports = NarrationManager;
