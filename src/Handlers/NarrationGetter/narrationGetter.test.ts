import { SessionData } from '../../Models/AppModels';
import { basicNarration } from '../../Mocks/SessionDataMocks/NarrationMocks';
import getNarration from './narrationGetter';
import { existingNarrationQuery, nonExistentNarrationQuery } from '../../Mocks/QueryMocks/narrationQuerries';
import { expect } from 'chai';
import { InvalidInputError } from '../../Common/Errors';

describe('Handlers >> NarrationGetter >> narrationGetter', () => {
	const testData: SessionData = {
		channelId: 'test',
		narrationSet: [basicNarration],
	};
	it('returns the test if a existing name is given', () => {
		const result = getNarration(testData, existingNarrationQuery);
		expect(result).to.deep.eq(basicNarration);
	});

	it('throws an error if a non existing name is given', () => {
		expect(() => {
			getNarration(testData, nonExistentNarrationQuery);
		}).to.throw(InvalidInputError);
	});
});
