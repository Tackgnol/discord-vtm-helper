import TurndownService from 'turndown';
import { MessageEmbed } from 'discord.js';
import { settings } from '../../config/settings';

export const globalTestRichEmbedInit = (testText: string = '', added = false) => {
	const turndownService = new TurndownService();
	const markdown = turndownService.turndown(testText);
	return new MessageEmbed()
		.setTitle(added ? 'Successfully added event' : settings.lines.globalTestHeader)
		.setDescription(markdown)
		.setColor(settings.colors.richEmbeddedMain);
};

export const globalTestRichEmbedResult = (replyPrefix: string, reply: string | null): MessageEmbed => {
	const turndownService = new TurndownService();
	const markdownPrefix = turndownService.turndown(replyPrefix);
	const markdownReply = turndownService.turndown(reply);
	if (!reply) {
		throw EvalError('No Reply provided');
	}
	return new MessageEmbed()
		.setTitle(settings.lines.globalTestReply)
		.addField(markdownPrefix, markdownReply)
		.setColor(settings.colors.richEmbeddedMain);
};
