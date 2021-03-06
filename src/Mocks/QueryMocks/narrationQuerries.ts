import { IEvent } from '../../Models/GameData';

export const existingNarrationQuery: Partial<IEvent> = {
	eventName: 'test',
	type: 'n',
	prefix: '!vtm',
};

export const nonExistentNarrationQuery: Partial<IEvent> = {
	eventName: 'nonExistent',
	type: 'n',
	prefix: '!vtm',
};

export const channelNarration = {
	message: `${existingNarrationQuery.prefix}-${existingNarrationQuery.type}-${existingNarrationQuery.eventName}`,
	result: { ...existingNarrationQuery },
};
