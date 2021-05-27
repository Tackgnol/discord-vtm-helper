import { find } from 'lodash';
import { settings } from '../../config/settings';
import { npcListRichEmbed, npcRichEmbed } from '../../Common';
import { Reply, ReplyType } from '../../Models/AppModels';
import { InvalidInputError } from '../../Common/Errors/InvalidInputError';
import { NPC } from '../../Models/GameData';

class NPCManager {
	displayNPCInfo(eventType: string, factSet: NPC[]): Reply {
		if (eventType === settings.subPrefixes.npcsSubCommands.all) {
			return this.allNPCs(factSet);
		} else {
			return this.oneNPC(factSet, eventType);
		}
	}

	private allNPCs(npcs: NPC[]): Reply {
		const npcList = npcs.map(npc => {
			return npc && `- ${npc.name} ${settings.lines.npcType} !vtm-npcs-${npc.callName}`;
		});
		return { type: ReplyType.Personal, value: npcListRichEmbed(npcList) };
	}

	private oneNPC(npcs: NPC[], npcCall: string): Reply {
		const npc = find(npcs, n => n.callName === npcCall);
		if (npc) {
			return { type: ReplyType.Personal, value: npcRichEmbed(npc) };
		} else {
			throw new InvalidInputError('NPC not found!');
		}
	}
}

export default NPCManager;
