import TurndownService from 'turndown';
import { MessageEmbed } from 'discord.js';
import { settings } from '../../config/settings';

export const narrationRichEmbed = (narrationText: string, image?: string, added = false) => {
	const turndownService = new TurndownService();
	const markdown = turndownService.turndown(narrationText);
	return new MessageEmbed()
		.setColor(settings.colors.richEmbeddedMain)
		.setTitle(added ? `Successfully added event: ${settings.lines.narrationHeader}` : settings.lines.narrationHeader)
		.setDescription(markdown)
		.setImage(image ?? '');
};
