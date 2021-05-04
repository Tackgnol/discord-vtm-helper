import { find } from 'lodash';
import { settings } from '../../config/settings';
import { npcListRichEmbed, npcRichEmbed } from '../../Common';
import { IReply, ReplyType } from '../../Models/AppModels';
import { InvalidInputError } from '../../Common/Errors/InvalidInputError';
import { INPC } from '../../Models/GameData';

class NPCManager {
	displayNPCInfo(eventType: string, factSet: INPC[]): IReply {
		if (eventType === settings.subPrefixes.npcsSubCommands.all) {
			return this.allNPCs(factSet);
		} else {
			return this.oneNPC(factSet, eventType);
		}
	}

	private allNPCs(npcs: INPC[]): IReply {
		const npcList = npcs.map(npc => {
			return npc && `- ${npc.name} ${settings.lines.npcType} !vtm-npcs-${npc.callName}`;
		});
		return { type: ReplyType.Personal, value: npcListRichEmbed(npcList) };
	}

	private oneNPC(npcs: INPC[], npcCall: string): IReply {
		const npc = find(npcs, n => n.callName === npcCall);
		if (npc) {
			return { type: ReplyType.Personal, value: npcRichEmbed(npc) };
		} else {
			throw new InvalidInputError('NPC not found!');
		}
	}
}

export default NPCManager;
