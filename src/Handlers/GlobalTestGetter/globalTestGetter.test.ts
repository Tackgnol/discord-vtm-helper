import { ISessionData } from '../../Models/AppModels';
import { globalTestWithoutShortCircuitMock } from '../../Mocks/SessionDataMocks/GlobalTestMocks';
import getGlobalTest from './globalTestGetter';
import {
	existingGTQueryWithoutValue,
	existingGTQueryWithValue,
	nonExistingGTQueryWithoutValue,
	nonExistingGTQueryWithValue,
} from '../../Mocks/QueryMocks/globalTestQueries';
import { expect } from 'chai';

describe('Handlers >> GlobalTestGetter >> getGlobalTest', () => {
	const testData: ISessionData = {
		channelId: 'test',
		globaltestSet: [globalTestWithoutShortCircuitMock, globalTestWithoutShortCircuitMock],
	};
	it('returns the test if a existing property and value is given', () => {
		const result = getGlobalTest(testData, existingGTQueryWithValue);
		expect(result).to.deep.eq(globalTestWithoutShortCircuitMock);
	});

	it('returns the test if a existing property but no value is given', () => {
		const result = getGlobalTest(testData, existingGTQueryWithoutValue);
		expect(result).to.deep.eq(globalTestWithoutShortCircuitMock);
	});

	it('throws an error if a test does not exist and value is supplied', () => {
		expect(() => {
			getGlobalTest(testData, nonExistingGTQueryWithValue);
		}).to.throw;
	});

	it('throws an error if a test does not exist and no value is supplied', () => {
		expect(() => {
			getGlobalTest(testData, nonExistingGTQueryWithoutValue);
		}).to.throw;
	});
});
