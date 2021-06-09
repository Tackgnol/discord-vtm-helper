import { GlobalTest } from '../../Models/GameData';

export const globalTestWithoutShortCircuitMock: GlobalTest = {
	testMessage: 'test',
	shortCircuit: false,
	globaltestoptionSet: [
		{ minResult: 1, resultMessage: 'result for 1' },
		{ minResult: 5, resultMessage: 'result for 5' },
	],
	name: 'test',
	replyPrefix: 'testPrefix',
};
export const globalTestWithShortCircuitMock: GlobalTest = {
	testMessage: 'shortCircuitTest',
	shortCircuit: true,
	globaltestoptionSet: [
		{ minResult: 1, resultMessage: 'result for 1' },
		{ minResult: 5, resultMessage: 'result for 5' },
	],
	name: 'scTest',
	replyPrefix: 'testPrefix',
};
