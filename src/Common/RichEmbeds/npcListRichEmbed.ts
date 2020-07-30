import { RichEmbed } from 'discord.js';
import { settings } from '../../config/settings';

export const npcListRichEmbed = (npcList: string[]) => {
	const richEmbed = new RichEmbed()
		.setTitle(settings.lines.allNPCs)
		.setColor(settings.colors.richEmbeddedMain)
		.setDescription(npcList);
	return richEmbed;
};
