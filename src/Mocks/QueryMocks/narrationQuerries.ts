import { Event } from '../../Models/GameData';

export const existingNarrationQuery: Partial<Event> = {
	eventName: 'test',
	type: 'n',
	prefix: '!vtm',
};

export const nonExistentNarrationQuery: Partial<Event> = {
	eventName: 'nonExistent',
	type: 'n',
	prefix: '!vtm',
};

export const channelNarration = {
	message: `${existingNarrationQuery.prefix}-${existingNarrationQuery.type}-${existingNarrationQuery.eventName}`,
	result: { ...existingNarrationQuery },
};
