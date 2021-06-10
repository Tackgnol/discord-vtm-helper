import chai, { expect } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { globalTestMapper } from './globalTest.mapper';
import { globalTestWithShortCircuitMock } from '../../Mocks/SessionDataMocks/GlobalTestMocks';

chai.use(jestSnapshotPlugin());

describe('Services >> Mappers >> globalTestMapper', () => {
	it('properly maps a global test', () => {
		const result = globalTestMapper(globalTestWithShortCircuitMock);
		expect(result).toMatchSnapshot();
		expect(result).to.exist;
	});

	it('throws an error on name missing', () => {
		expect(() => {
			globalTestMapper({ ...globalTestWithShortCircuitMock, name: undefined });
		}).to.throw(Error);
	});

	it('throws an error on shortCircuit missing', () => {
		expect(() => {
			globalTestMapper({ ...globalTestWithShortCircuitMock, shortCircuit: undefined });
		}).to.throw(Error);
	});

	it('throws an error on replyPrefix missing', () => {
		expect(() => {
			globalTestMapper({ ...globalTestWithShortCircuitMock, replyPrefix: undefined });
		}).to.throw(Error);
	});

	it('throws an error on testMessage missing', () => {
		expect(() => {
			globalTestMapper({ ...globalTestWithShortCircuitMock, testMessage: undefined });
		}).to.throw(Error);
	});

	it('throws an error on globaltestoptionSet missing', () => {
		expect(() => {
			globalTestMapper({ ...globalTestWithShortCircuitMock, globaltestoptionSet: undefined });
		}).to.throw(Error);
	});

	it('throws an error on globaltestoptionSet being empty', () => {
		expect(() => {
			globalTestMapper({ ...globalTestWithShortCircuitMock, globaltestoptionSet: [] });
		}).to.throw(Error);
	});
});
