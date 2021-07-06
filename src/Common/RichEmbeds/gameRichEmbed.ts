import { MessageEmbed } from 'discord.js';
import { settings } from '../../config/settings';
import { Game } from '../../Models/AppModels';

export const gameRichEmbed = (game: Game) => {
	return new MessageEmbed()
		.setColor(settings.colors.richEmbeddedMain)
		.setTitle(`Successfully added game: ${game.id}`)
		.setDescription(`Game active on channel: ${game.activeChannel}`)
		.addField('adminId', game.adminId);
};
