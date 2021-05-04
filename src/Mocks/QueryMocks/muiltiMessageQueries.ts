import { IEvent } from '../../Models/GameData';

export const multiMessageQuery: Partial<IEvent> = {
	eventName: 'test',
	type: 'mm',
	prefix: '!vtm',
};

export const nonExistentMultiMessage: Partial<IEvent> = {
	eventName: 'nonExistent',
	type: 'mm',
	prefix: '!vtm',
};

export const channelMultiMessage = {
	message: `${multiMessageQuery.prefix}-${multiMessageQuery.type}-${multiMessageQuery.eventName}`,
	result: { ...multiMessageQuery },
};
