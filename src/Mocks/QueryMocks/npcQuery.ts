import { IEvent } from '../../Models/GameData';

export const allNPCs: Partial<IEvent> = {
	eventName: 'all',
	type: 'npcs',
	prefix: '!vtm',
};

export const existingNPC: Partial<IEvent> = {
	eventName: 'testWithFacts',
	type: 'npcs',
	prefix: '!vtm',
};

export const nonExistentNPC: Partial<IEvent> = {
	eventName: 'nonExistent',
	type: 'npcs',
	prefix: '!vtm',
};

export const channelNPC = {
	message: `${existingNPC.prefix}-${existingNPC.type}-${existingNPC.eventName}`,
	result: existingNPC,
};
