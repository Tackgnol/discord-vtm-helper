import { Event } from '../../Models/GameData';

export const multiMessageQuery: Partial<Event> = {
	eventName: 'test',
	type: 'mm',
	prefix: '!vtm',
};

export const nonExistentMultiMessage: Partial<Event> = {
	eventName: 'nonExistent',
	type: 'mm',
	prefix: '!vtm',
};

export const channelMultiMessage = {
	message: `${multiMessageQuery.prefix}-${multiMessageQuery.type}-${multiMessageQuery.eventName}`,
	result: { ...multiMessageQuery },
};
