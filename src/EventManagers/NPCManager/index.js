const { RichEmbed } = require('discord.js');
const TurndownService = require('turndown');
const { find } = require('lodash');
const settings = require('../../../config/settings')

class NPCManager {
	constructor(message) {
		this.message = message;
	}

	allNPCs(factSets) {
		const npcs = factSets.map(
			fact => {
				const npc = fact.npc;
				return npc && `- ${npc.name} ${settings.Lines.npcType} !vtm-npcs-${npc.callName}`;
			})
		const richEmbed = new RichEmbed()
			.setTitle(settings.Lines.allNPCs)
			.setColor(settings.colors.richEmbeddedMain)
			.setDescription(npcs);
		this.message.author.send(richEmbed);
	}

	oneNPC(factSet, npcCall) {
		let facts;
		const turndownService = new TurndownService()
		const npcs = factSet.map(
			fact => {
				const npc = fact.npc;
				return npc && { ...npc, facts: fact.facts };
			});
		const npc = find(npcs, n => n.callName === npcCall);
		if (npc) {
			const richEmbed = new RichEmbed()
				.setTitle(npc.name)
				.setColor(settings.colors.richEmbeddedDetails)
				.setThumbnail(npc.image)
				.setDescription(turndownService.turndown(npc.description));
			if (npc.facts) {
				facts = npc.facts.map(
					f => (`- ${f}`)
				);
				richEmbed
					.addField('Facts:', facts);
			}
			this.message.author.send(richEmbed);
		}
	}

}

module.exports = NPCManager;
