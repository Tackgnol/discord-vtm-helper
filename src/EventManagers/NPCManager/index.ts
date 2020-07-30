import { find } from 'lodash';
import { settings } from '../../config/settings';
import { npcListRichEmbed, npcRichEmbed } from '../../Common/RichEmbeds';
import { Message } from 'discord.js';
import { IFactSet } from '../../Models/GameData';

class NPCManager {
	constructor(private message?: Message) {
		this.message = message;
	}

	allNPCs(factSets: IFactSet[]) {
		const npcList = factSets.map(fact => {
			const npc = fact.npc;
			return npc && `- ${npc.name} ${settings.lines.npcType} !vtm-npcs-${npc.callName}`;
		});
		const richEmbed = npcListRichEmbed(npcList);
		this.message && this.message.author.send(richEmbed);
	}

	oneNPC(factSet: IFactSet[], npcCall: string) {
		let facts;
		const npcs = factSet.map(fact => {
			const npc = fact.npc;
			return npc && { ...npc, facts: fact.facts };
		});
		const npc = find(npcs, n => n.callName === npcCall);
		if (npc) {
			const richEmbed = npcRichEmbed(npc);
			this.message && this.message.author.send(richEmbed);
		}
	}
}

export default NPCManager;
