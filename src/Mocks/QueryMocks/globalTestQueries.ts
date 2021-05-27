import { Event } from '../../Models/GameData';

export const existingGTQueryWithoutValue: Partial<Event> = {
	eventName: 'test',
	type: 'gt',
	prefix: '!vtm',
};

export const existingGTQueryWithValue: Partial<Event> = {
	eventName: 'test',
	value: '5',
	type: 'gt',
	prefix: '!vtm',
};

export const nonExistingGTQueryWithoutValue: Partial<Event> = {
	eventName: 'nonExistent',
	type: 'gt',
	prefix: '!vtm',
};

export const nonExistingGTQueryWithValue: Partial<Event> = {
	eventName: 'nonExistent',
	value: '5',
	type: 'gt',
	prefix: 'vtm',
};

export const channelTestTryLow = { message: '!test 1', value: '1' };
export const channelTest = {
	message: `${existingGTQueryWithoutValue.prefix}-${existingGTQueryWithoutValue.type}-${existingGTQueryWithoutValue.eventName}`,
	result: { ...existingGTQueryWithoutValue },
};
