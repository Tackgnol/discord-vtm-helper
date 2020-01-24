const TurndownService = require('turndown');

class NarrationManager {
	constructor(message, channel) {
		this.message = message;
		this.channel = channel;
	}

	displayNarration(narrationText, image = null) {
		const messageChanel = this.channel;
		const turndownService = new TurndownService()
		const markdown = turndownService.turndown(narrationText)
		messageChanel.send(`${markdown} \n ${image}`);
	}

}

module.exports = NarrationManager;
