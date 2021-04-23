import { MessageEmbed } from 'discord.js';
import { settings } from '../../config/settings';

export const npcListRichEmbed = (npcList: string[]) => {
	return new MessageEmbed()
		.setTitle(settings.lines.allNPCs)
		.setColor(settings.colors.richEmbeddedMain)
		.setDescription(npcList);
};
