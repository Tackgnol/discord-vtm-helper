import { parseEventMessage } from './parseEventMessage';
import { channelTest } from '../Mocks/QueryMocks/globalTestQueries';
import { expect } from 'chai';
import { channelMultiMessage } from '../Mocks/QueryMocks/muiltiMessageQueries';
import { channelNarration } from '../Mocks/QueryMocks/narrationQuerries';
import { channelNPC } from '../Mocks/QueryMocks/npcQuery';
import { channelStatInsight } from '../Mocks/QueryMocks/statInsightQuerries';

describe('Common >> parseEventMessage', () => {
	it('parses a proper globalTest message', () => {
		const result = parseEventMessage(channelTest.message);
		expect(result).to.deep.eq({ ...channelTest.result });
	});

	it('parses a proper multiMessage message', () => {
		const result = parseEventMessage(channelMultiMessage.message);
		expect(result).to.deep.eq(channelMultiMessage.result);
	});

	it('parses a proper narration message', () => {
		const result = parseEventMessage(channelNarration.message);
		expect(result).to.deep.eq(channelNarration.result);
	});

	it('parses a proper npc message', () => {
		const result = parseEventMessage(channelNPC.message);
		expect(result).to.deep.eq(channelNPC.result);
	});

	it('parses a proper statInsight message', () => {
		const result = parseEventMessage(channelStatInsight.message);
		expect(result).to.deep.eq(channelStatInsight.result);
	});

	it('throws on a not parsable message', () => {
		expect(() => {
			parseEventMessage('well this is unexpected');
		}).to.throw;
		expect(() => {
			parseEventMessage('well-this-is-unexpected');
		}).to.throw;
	});
});
