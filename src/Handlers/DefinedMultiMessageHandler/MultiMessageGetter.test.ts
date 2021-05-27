import { SessionData } from '../../Models/AppModels';
import { multiMessageMock } from '../../Mocks/SessionDataMocks/MultiMessageMock';
import { getMultiMessage } from './MultiMessageGetter';
import { multiMessageQuery, nonExistentMultiMessage } from '../../Mocks/QueryMocks/muiltiMessageQueries';
import { expect } from 'chai';

describe('Handlers >> DefinedMultiMessageHandler >> getMultiMessage', () => {
	const testData: SessionData = {
		channelId: '0',
		multiMessageSet: [multiMessageMock],
	};
	it('returns a event if a existing name is provided', () => {
		const result = getMultiMessage(testData, multiMessageQuery);
		expect(result).to.deep.eq(multiMessageMock);
	});

	it('throws an error on non existent name', () => {
		expect(() => {
			getMultiMessage(testData, nonExistentMultiMessage);
		}).to.throw;
	});
});
