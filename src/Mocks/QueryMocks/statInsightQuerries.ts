import { IEvent } from '../../Models/GameData';

export const statInsightLower: Partial<IEvent> = {
	eventName: 'test',
	type: 'si',
	value: '1',
	prefix: 'vtm',
};

export const statInsightEqual: Partial<IEvent> = {
	eventName: 'test',
	type: 'si',
	value: '2',
	prefix: 'vtm',
};

export const statInsightHigher: Partial<IEvent> = {
	eventName: 'test',
	type: 'si',
	value: '3',
	prefix: 'vtm',
};

export const nonExistentStatInsight: Partial<IEvent> = {
	eventName: 'nonExistent',
	type: 'si',
	value: '3',
	prefix: 'vtm',
};

export const statInsightNoValue: Partial<IEvent> = {
	eventName: 'test',
	type: 'si',
	prefix: 'vtm',
};
