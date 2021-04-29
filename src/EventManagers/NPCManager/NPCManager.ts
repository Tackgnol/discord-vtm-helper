import { find } from 'lodash';
import { settings } from '../../config/settings';
import { npcListRichEmbed, npcRichEmbed } from '../../Common';
import { IFactSet } from '../../Models/GameData';
import { IReply, ReplyType } from '../../Models/AppModels';
import { InvalidInputError } from '../../Common/Errors/InvalidInputError';

class NPCManager {
	handle(eventType: string, factSet: IFactSet[]): IReply {
		if (eventType === settings.subPrefixes.npcsSubCommands.all) {
			return this.allNPCs(factSet);
		} else {
			return this.oneNPC(factSet, eventType);
		}
	}

	allNPCs(factSets: IFactSet[]): IReply {
		const npcList = factSets.map(fact => {
			const npc = fact.npc;
			return npc && `- ${npc.name} ${settings.lines.npcType} !vtm-npcs-${npc.callName}`;
		});
		return { type: ReplyType.Personal, value: npcListRichEmbed(npcList) };
	}

	oneNPC(factSet: IFactSet[], npcCall: string): IReply {
		const npcs = factSet.map(fact => {
			const npc = fact.npc;
			return npc && { ...npc, facts: fact.facts };
		});
		const npc = find(npcs, n => n.callName === npcCall);
		if (npc) {
			return { type: ReplyType.Personal, value: npcRichEmbed(npc) };
		} else {
			throw new InvalidInputError('NPC not found!');
		}
	}
}

export default NPCManager;
