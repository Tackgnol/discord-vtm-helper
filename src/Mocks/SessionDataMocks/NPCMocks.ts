import { INPC } from '../../Models/GameData';

export const testNPCWithFacts: INPC = {
	callName: 'testWithFacts',
	description: 'this is a test',
	image: 'placeholder',
	name: 'Test',
	facts: ['fact1', 'fact2'],
};

export const testNPCWithoutFacts: INPC = {
	callName: 'testWithout',
	description: 'this is a test',
	image: 'placeholder',
	name: 'Test',
	facts: [],
};
