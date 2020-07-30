import TurndownService from 'turndown';
import { RichEmbed } from 'discord.js';
import { settings } from '../../config/settings';

export const narrationRichEmbed = (narrationText: string, image?: string) => {
	const turndownService = new TurndownService();
	const markdown = turndownService.turndown(narrationText);
	const richEmbed = new RichEmbed()
		.setColor(settings.colors.richEmbeddedMain)
		.setTitle(settings.lines.narrationHeader)
		.setDescription(markdown)
		.setImage(image ?? '');

	return richEmbed;
};
