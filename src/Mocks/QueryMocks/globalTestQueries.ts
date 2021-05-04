import { IEvent } from '../../Models/GameData';

export const existingGTQueryWithoutValue: Partial<IEvent> = {
	eventName: 'test',
	type: 'gt',
	prefix: '!vtm',
};

export const existingGTQueryWithValue: Partial<IEvent> = {
	eventName: 'test',
	value: '5',
	type: 'gt',
	prefix: '!vtm',
};

export const nonExistingGTQueryWithoutValue: Partial<IEvent> = {
	eventName: 'nonExistent',
	type: 'gt',
	prefix: '!vtm',
};

export const nonExistingGTQueryWithValue: Partial<IEvent> = {
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
