import { MessageEmbed } from 'discord.js';

import { settings } from '../../config/settings';
import { NPC } from '../../Models/GameData';
import TurndownService from 'turndown';

export const npcRichEmbed = (npc: Partial<NPC>, added = false, adminInfo = false) => {
	const turndownService = new TurndownService();
	const richEmbed = new MessageEmbed()
		.setTitle(added ? `Successfully added a npc:${npc.name}` : npc.name)
		.setColor(settings.colors.richEmbeddedDetails)
		.setThumbnail(npc.image ?? '')
		.setDescription(turndownService.turndown(npc.description));
	if (npc.facts) {
		const facts = npc.facts.map(f => `- ${f}`);
		richEmbed.addField('Facts:', facts);
	}
	if (adminInfo) {
		richEmbed.setFooter(`npc call name is ${npc.callName}`);
	}
	return richEmbed;
};
