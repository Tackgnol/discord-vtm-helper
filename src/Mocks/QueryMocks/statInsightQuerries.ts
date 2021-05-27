import { Event } from '../../Models/GameData';

export const statInsightLower: Partial<Event> = {
	eventName: 'test',
	type: 'si',
	value: '1',
	prefix: '!vtm',
};

export const statInsightEqual: Partial<Event> = {
	eventName: 'test',
	type: 'si',
	value: '2',
	prefix: '!vtm',
};

export const statInsightHigher: Partial<Event> = {
	eventName: 'test',
	type: 'si',
	value: '3',
	prefix: '!vtm',
};

export const nonExistentStatInsight: Partial<Event> = {
	eventName: 'nonExistent',
	type: 'si',
	value: '3',
	prefix: '!vtm',
};

export const statInsightNoValue: Partial<Event> = {
	eventName: 'test',
	type: 'si',
	prefix: '!vtm',
};

export const channelStatInsight = {
	message: `${statInsightNoValue.prefix}-${statInsightNoValue.type}-${statInsightNoValue.eventName}`,
	result: statInsightNoValue,
};
