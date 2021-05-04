import { parseCommandMessage } from './parseCommandMessage';
import { channelTest, channelTestTryLow } from '../Mocks/QueryMocks/globalTestQueries';
import { activeSessionMock } from '../Mocks/SessionDataMocks/ActiveSessionMock';
import { expect } from 'chai';

describe('Common >> parseCommandMessage', () => {
	const {
		prevCommand: { prefix, type, eventName },
	} = activeSessionMock;
	it('properly parses a correct message', () => {
		const result = parseCommandMessage(channelTestTryLow.message, activeSessionMock);
		expect(result).to.deep.eq({ type, prefix, eventName, value: channelTestTryLow.value });
	});

	it('returns null if message is not !test', () => {
		const result = parseCommandMessage(channelTest.message, activeSessionMock);
		expect(result).to.eq(null);
	});
});
