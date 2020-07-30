import TurndownService from 'turndown';
import { RichEmbed } from 'discord.js';
import { settings } from '../../config/settings';

const globalTestRichEmbedInit = (testText: string) => {
	const turndownService = new TurndownService();
	const markdown = turndownService.turndown(testText);
	const richEmbed = new RichEmbed()
		.setTitle(settings.lines.globalTestHeader)
		.setDescription(markdown)
		.setColor(settings.colors.richEmbeddedMain);

	return richEmbed;
};

const globalTestRichEmbedResult = (replyPrefix: string, reply: string | null): RichEmbed | null => {
	const turndownService = new TurndownService();
	const markdownPrefix = turndownService.turndown(replyPrefix);
	const markdownReply = turndownService.turndown(reply);
	if (!reply) {
		return null;
	}
	const richEmbed = new RichEmbed()
		.setTitle(settings.lines.globalTestReply)
		.addField(markdownPrefix, markdownReply)
		.setColor(settings.colors.richEmbeddedMain);
	return richEmbed;
};
export { globalTestRichEmbedInit, globalTestRichEmbedResult };
