import TurndownService from 'turndown';
import { RichEmbed } from 'discord.js';
import { settings } from '../../config/settings';

export const statInsightRichEmbed = (statName: string, minValue: number, successMessage: string) => {
	const turndownService = new TurndownService();
	const markdown = turndownService.turndown(successMessage);
	return new RichEmbed()
		.setTitle(settings.lines.statInsightHeader)
		.addField(statName, minValue)
		.setDescription(markdown)
		.setColor(settings.colors.richEmbeddedMain);
};
