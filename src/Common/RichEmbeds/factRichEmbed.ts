import { MessageEmbed } from 'discord.js';

import { settings } from '../../config/settings';
import { PlayerFacts } from '../../Models/AppModels';

export const factRichEmbed = (facts: PlayerFacts[]) => {
	const richEmbed = new MessageEmbed()
		.setTitle(`Successfully added facts to a npc`)
		.setColor(settings.colors.richEmbeddedDetails);

	for (let i = 0; i < facts.length; i++) {
		const factList = facts[i];
		richEmbed.addField(`Player: ${factList.player}`, factList.facts.toString());
	}

	return richEmbed;
};
