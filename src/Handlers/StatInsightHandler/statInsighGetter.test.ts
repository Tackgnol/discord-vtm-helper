import getStatInsight from './statInsightGetter';
import { SessionData } from '../../Models/AppModels';
import { statInsightMockLow } from '../../Mocks/SessionDataMocks/StatInsightMocks';
import { nonExistentStatInsight, statInsightLower, statInsightNoValue } from '../../Mocks/QueryMocks/statInsightQuerries';
import { expect } from 'chai';
import { InvalidInputError } from '../../Common/Errors';

describe('Handlers >> StatInsightGetter >> statInsightGetter', () => {
	const testData: SessionData = {
		channelId: '0',
		statInsightSet: [statInsightMockLow],
	};
	it('returns the test if a existing name and value is given', () => {
		const result = getStatInsight(testData, statInsightLower);
		expect(result).to.deep.eq(statInsightMockLow);
	});

	it('returns the test if a existing name and no value is given', () => {
		const result = getStatInsight(testData, statInsightNoValue);
		expect(result).to.deep.eq(statInsightMockLow);
	});

	it('throws an error if a non existent name', () => {
		expect(() => {
			getStatInsight(testData, nonExistentStatInsight);
		}).to.throw(InvalidInputError);
	});
});
