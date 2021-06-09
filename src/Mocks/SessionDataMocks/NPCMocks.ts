import { NPC } from '../../Models/GameData';

export const testNPCWithFacts: NPC = {
	callName: 'testWithFacts',
	description: 'this is a test',
	image: 'placeholder',
	name: 'Test',
	facts: ['fact1', 'fact2'],
	gameId: 'x',
};

export const testNPCWithoutFacts: NPC = {
	callName: 'testWithout',
	description: 'this is a test',
	image: 'placeholder',
	name: 'Test',
	facts: [],
	gameId: 'x',
};
