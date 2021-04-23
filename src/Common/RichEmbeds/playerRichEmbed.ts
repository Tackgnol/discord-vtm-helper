import { MessageEmbed } from 'discord.js';
import { settings } from '../../config/settings';
import { IStat } from '../../Models/GameData';

export const playerRichEmbed = (name: string, id: string, statArray: IStat[], added: boolean = false) => {
	const richEmbed = new MessageEmbed()
		.setTitle(added ? `'New player (${name}) added successfully` : name)
		.setColor(settings.colors.richEmbeddedMain)
		.setDescription(`DiscordId: ${id}`);
	for (const s of statArray) {
		richEmbed.addField(s.name, s.value);
	}
	return richEmbed;
};
