import { RichEmbed } from 'discord.js';
import { settings } from '../../config/settings';
import { IStat } from '../../Models/GameData';

export const playerRichEmbed = (name: string, id: string, statArray: IStat[]) => {
	const richEmbed = new RichEmbed()
		.setTitle(name)
		.setColor(settings.colors.richEmbeddedMain)
		.setDescription(`DiscordId: ${id}`);
	for (const s of statArray) {
		richEmbed.addField(s.name, s.value);
	}
	return richEmbed;
};
