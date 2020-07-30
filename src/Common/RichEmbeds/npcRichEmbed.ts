import { RichEmbed } from 'discord.js';
import TurndownService from 'turndown';
import { settings } from '../../config/settings';
import { INPC } from '../../Models/GameData';

export const npcRichEmbed = (npc: Partial<INPC>, adminInfo = false) => {
	const turndownService = new TurndownService();
	const richEmbed = new RichEmbed()
		.setTitle(npc.name)
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
