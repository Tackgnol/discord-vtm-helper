import { NPC } from '../../Models/GameData';
import { checkType } from './utils';

export const npcMapper = (object: any): NPC => {
	checkType<NPC>(object, 'callName', 'string');
	checkType<NPC>(object, 'name', 'string');
	checkType<NPC>(object, 'image', 'string');
	checkType<NPC>(object, 'description', 'string');
	checkType<NPC>(object, 'gameId', 'string');
	return {
		name: object?.name,
		callName: object?.callName,
		description: object?.description,
		image: object?.image,
		facts: object?.facts,
		gameId: object?.gameId,
	};
};
