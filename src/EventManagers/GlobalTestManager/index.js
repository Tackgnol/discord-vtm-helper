const { isEmpty, isNil, isNaN, sortBy, join } = require('lodash');
const { RichEmbed } = require('discord.js');
const reactionNumbers = require('../../Common/reactionNumbers');
const settings = require('../../../config/settings');

class GlobalTestManager {
	constructor(message, channel) {
		this.message = message;
		this.channel = channel;
	}

	performTest(testText, replyPrefix, versionOptions, shortCircut, value) {
		const messageChanel = this.channel;
		let reply;
		let richEmbed;
		if (messageChanel.type === 'text') {
			if (value === 0 || isNil(value)) {
				richEmbed = new RichEmbed()
					.setTitle(settings.Lines.globalTestHeader)
					.setDescription(testText)
					.setColor(settings.colors.richEmbeddedMain)
				messageChanel.send(richEmbed).then(
					async message => {
						await message.react(reactionNumbers[0]);
						await message.react(reactionNumbers[1]);
						await message.react(reactionNumbers[2]);
						await message.react(reactionNumbers[3]);
						await message.react(reactionNumbers[4]);
						await message.react(reactionNumbers[5]);
						await message.react(reactionNumbers[6]);
						await message.react(reactionNumbers[7]);
						await message.react(reactionNumbers[8]);
						await message.react(reactionNumbers[9]);
						const filter = (reaction, user) => {
							if (user.id !== message.author.id) {
								const reactValue = reactionNumbers.indexOf(reaction.emoji.name);
								if (shortCircut) {
									reply = this.shortCircutedTest(versionOptions, +reactValue);
								} else {
									reply = this.fullTest(versionOptions, +reactValue);
								}
								richEmbed = new RichEmbed()
									.setTitle(settings.Lines.globalTestReply)
									.addField(replyPrefix, reply)
									.setColor(settings.colors.richEmbeddedMain)
								this.message.author.send(richEmbed);
							}
						}
						message.awaitReactions(filter);
					}
				);
				return;
			}
			if (shortCircut) {
				reply = this.shortCircutedTest(versionOptions, +value);
			} else {
				reply = this.fullTest(versionOptions, +value);
			}
			richEmbed = new RichEmbed()
				.setTitle(settings.Lines.globalTestReply)
				.addField(replyPrefix, reply)
				.setColor(settings.colors.richEmbeddedMain)
			this.message.author.send(richEmbed);
		}
	}

	shortCircutedTest(versionOptions, value) {
		if (isEmpty(versionOptions) || isNaN(value)) {
			return;
		}

		const sortedOptions = sortBy(versionOptions, v => -v.minResult);
		for (let i = 0; i <= sortedOptions.length; i++) {
			const currentOption = sortedOptions[i];
			if (currentOption.minResult <= value) {
				return currentOption.resultMessage;
			}
		}
	}

	fullTest(versionOptions, value) {
		if (isEmpty(versionOptions) || isNaN(value)) {
			return;
		}
		const sortedOptions = sortBy(versionOptions, v => v.minResult);
		const messageArray = [];
		sortedOptions.forEach(o => {
			if (o.minResult <= value) {
				messageArray.push(o.resultMessage);
			}
		});
		return !isEmpty(messageArray) && join(messageArray, '\n\t');
	}
}

module.exports = GlobalTestManager;
