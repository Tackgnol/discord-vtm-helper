import { IGlobalTest } from '../../Models/GameData';

export const globalTestWithoutShortCircuitMock: IGlobalTest = {
	testMessage: 'test',
	shortCircuit: false,
	globaltestoptionSet: [
		{ minResult: 1, resultMessage: 'result for 1' },
		{ minResult: 5, resultMessage: 'result for 2' },
	],
	name: 'test',
	replyPrefix: 'testPrefix',
};
export const globalTestWithShortCircuitMock: IGlobalTest = {
	testMessage: 'shortCircuitTest',
	shortCircuit: true,
	globaltestoptionSet: [
		{ minResult: 1, resultMessage: 'result for 1' },
		{ minResult: 5, resultMessage: 'result for 2' },
	],
	name: 'scTest',
	replyPrefix: 'testPrefix',
};
