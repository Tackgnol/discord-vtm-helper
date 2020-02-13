const TurndownService = require('turndown');
const { RichEmbed } = require('discord.js');
const settings = require('../../../config/settings');

class NarrationManager {
	constructor(message, channel) {
		this.message = message;
		this.channel = channel;
	}

	displayNarration(narrationText, image = null) {
		const messageChanel = this.channel;
		const turndownService = new TurndownService();
		const markdown = turndownService.turndown(narrationText);
		const richEmbed = new RichEmbed()
			.setColor(settings.colors.richEmbeddedMain)
			.setTitle(settings.Lines.narrationHeader)
			.setDescription(markdown)
			.setImage(image)
		messageChanel.send(richEmbed);
	}

}

module.exports = NarrationManager;
