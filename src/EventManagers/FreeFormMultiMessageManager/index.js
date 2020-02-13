const { isEmpty, isNil } = require('lodash');
const { RichEmbed } = require('discord.js');
const settings = require('../../../config/settings');

class FreeFormMultiMessageManager {
	constructor(message, channel) {
		this.message = message;
		this.channel = channel;
	}

	messageUsers(reply, userList) {
		const messageChanel = this.channel;
		if (messageChanel.type === 'text') {
			const channelMembers = messageChanel.members;
			if (!isEmpty(userList)) {
				userList.forEach(u => {
					const foundUser = channelMembers.find(val => val.user.username === u);
					if (!isNil(foundUser)) {
						const richEmbed = new RichEmbed()
							.setColor(settings.colors.richEmbeddedMain)
							.setTitle(settings.Lines.userMessageHeader)
							.setDescription(reply)
							.setColor(settings.colors.richEmbeddedMain);
						foundUser.send(richEmbed);
					}
				});
			}
		}
	}
}

module.exports = FreeFormMultiMessageManager;
