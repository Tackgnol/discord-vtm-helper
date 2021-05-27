import { Event } from '../../Models/GameData';

export const allNPCs: Partial<Event> = {
	eventName: 'all',
	type: 'npcs',
	prefix: '!vtm',
};

export const existingNPC: Partial<Event> = {
	eventName: 'testWithFacts',
	type: 'npcs',
	prefix: '!vtm',
};

export const nonExistentNPC: Partial<Event> = {
	eventName: 'nonExistent',
	type: 'npcs',
	prefix: '!vtm',
};

export const channelNPC = {
	message: `${existingNPC.prefix}-${existingNPC.type}-${existingNPC.eventName}`,
	result: existingNPC,
};
