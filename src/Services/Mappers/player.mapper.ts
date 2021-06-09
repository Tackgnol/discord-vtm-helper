import { Player } from '../../Models/GameData';
import { checkType, mapArray } from './utils';
import { npcMapper } from './npc.mapper';
import { statisticsMapper } from './statistics.mapper';

export const playerMapper = (object: any): Player => {
	checkType<Player>(object, 'id', 'string');
	checkType<Player>(object, 'discordUserName', 'string');

	return {
		id: object?.id,
		discordUserName: object?.discordUserName,
		npcSet: mapArray(object?.npcSet, npcMapper, true),
		statisticsSet: mapArray(object?.statisticsSet, statisticsMapper, true),
	};
};
