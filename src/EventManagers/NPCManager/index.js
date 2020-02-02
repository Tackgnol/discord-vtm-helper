const { RichEmbed } = require('discord.js');
const TurndownService = require('turndown');
const { find } = require('lodash');

class NPCManager {
	constructor(message) {
		this.message = message;
	}

	allNPCs(factSets) {
		const npcs = factSets.map(
			fact => {
				const npc = fact.npc;
				return npc && `- ${npc.name} type in !vtm-npcs-${npc.callName}`;
			})
		const richEmbed = new RichEmbed()
			.setTitle('Available NPCs')
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
				.setImage(npc.image);

			if (npc.facts) {
				facts = npc.facts.map(
					f => (`- ${f}`)
				);
			}
			richEmbed.setDescription(turndownService.turndown(npc.description) + '\n \n' + 'Facts:\n' + facts);
			this.message.author.send(richEmbed);
		}
	}

}

module.exports = NPCManager;
