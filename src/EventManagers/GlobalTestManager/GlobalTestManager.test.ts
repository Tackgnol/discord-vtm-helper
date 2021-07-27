import { GlobalTestManager } from './GlobalTestManager';
import {
	globalTestWithoutShortCircuitMock,
	globalTestWithShortCircuitMock,
} from '../../Mocks/SessionDataMocks/GlobalTestMocks';
import chai, { expect } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { InvalidInputError } from '../../Common/Errors/InvalidInputError';
import { BackendServiceMock } from '../../Mocks/Services/backendServiceMock';

chai.use(jestSnapshotPlugin());

describe('EventManagers >> GlobalTestManager >> GlobalTestManager', () => {
	const manager = new GlobalTestManager();
	it('can perform a short circuit test', () => {
		const { testMessage, replyPrefix, globaltestoptionSet, shortCircuit } = globalTestWithShortCircuitMock;
		const result = manager.performTest(testMessage, replyPrefix, globaltestoptionSet, shortCircuit, 5);
		expect(result).toMatchSnapshot();
	});

	it('can perform a full test', () => {
		const { testMessage, replyPrefix, globaltestoptionSet, shortCircuit } = globalTestWithoutShortCircuitMock;
		const result = manager.performTest(testMessage, replyPrefix, globaltestoptionSet, shortCircuit, 5);
		expect(result).toMatchSnapshot();
	});

	it('returns a proper value on to low of a score', () => {
		const { testMessage, replyPrefix, globaltestoptionSet, shortCircuit } = globalTestWithoutShortCircuitMock;
		const result = manager.performTest(testMessage, replyPrefix, globaltestoptionSet, shortCircuit, 0);
		expect(result).toMatchSnapshot();
	});

	it('throws an error if the value cannot be converted to a number', () => {
		const { testMessage, replyPrefix, globaltestoptionSet, shortCircuit } = globalTestWithoutShortCircuitMock;
		expect(() => {
			manager.performTest(testMessage, replyPrefix, globaltestoptionSet, shortCircuit, 'test');
		}).to.throw(InvalidInputError);
	});

	it('throws an error if there no options given', () => {
		const { testMessage, replyPrefix, shortCircuit } = globalTestWithoutShortCircuitMock;
		expect(() => {
			manager.performTest(testMessage, replyPrefix, [], shortCircuit, 3);
		}).to.throw(InvalidInputError);
	});
});
