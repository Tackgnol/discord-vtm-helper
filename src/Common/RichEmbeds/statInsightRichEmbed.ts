import TurndownService from 'turndown';
import { MessageEmbed } from 'discord.js';
import { settings } from '../../config/settings';

export const statInsightRichEmbed = (statName: string, minValue: number, successMessage: string, added = false) => {
	const turndownService = new TurndownService();
	const markdown = turndownService.turndown(successMessage);
	return new MessageEmbed()
		.setTitle(added ? `Successfully added event` : settings.lines.statInsightHeader)
		.addField(statName, minValue)
		.setDescription(markdown)
		.setColor(settings.colors.richEmbeddedMain);
};
