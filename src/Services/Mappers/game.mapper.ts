import { Game } from '../../Models/AppModels';
import { checkType, mapArray } from './utils';
import { playerMapper } from './player.mapper';
import { sessionMapper } from './session.mapper';

export const gameMapper = (object: any): Game => {
	checkType<Game>(object, 'id', 'string');
	checkType<Game>(object, 'adminId', 'string');
	checkType<Game>(object, 'activeChannel', 'string');
	checkType<Game>(object, 'current', 'boolean');

	return {
		id: object?.id,
		activeChannel: object?.activeChannel,
		adminId: object?.adminId,
		current: object?.current,
		players: mapArray(object?.players, playerMapper, true),
		channels: mapArray(object?.channels, sessionMapper, true),
	};
};
