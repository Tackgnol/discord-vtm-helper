import getStatInsight from './statInsightGetter';
import { ISessionData } from '../../Models/AppModels';
import { statInsightMock } from '../../Mocks/SessionDataMocks/StatInsightMocks';
import { nonExistentStatInsight, statInsightLower, statInsightNoValue } from '../../Mocks/QueryMocks/statInsightQuerries';
import { expect } from 'chai';

describe('Handlers >> StatInsightGetter >> statInsightGetter', () => {
	const testData: ISessionData = {
		channelId: '0',
		statInsightSet: [statInsightMock],
	};
	it('returns the test if a existing name and value is given', () => {
		const result = getStatInsight(testData, statInsightLower);
		expect(result).to.deep.eq(statInsightMock);
	});

	it('returns the test if a existing name and no value is given', () => {
		const result = getStatInsight(testData, statInsightNoValue);
		expect(result).to.deep.eq(statInsightMock);
	});

	it('throws an error if a non existent name', () => {
		expect(() => {
			getStatInsight(testData, nonExistentStatInsight);
		}).to.throw;
	});
});
