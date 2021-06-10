import { SessionData } from '../../Models/AppModels';
import { globalTestWithoutShortCircuitMock, globalTestWithShortCircuitMock } from './GlobalTestMocks';
import { multiMessageMock } from './MultiMessageMock';
import { basicNarration } from './NarrationMocks';
import { statInsightMockHigh, statInsightMockLow } from './StatInsightMocks';

export const sessionMock: SessionData = {
	channelId: '0',
	globaltestSet: [globalTestWithoutShortCircuitMock, globalTestWithShortCircuitMock],
	multiMessageSet: [multiMessageMock],
	narrationSet: [basicNarration],
	statInsightSet: [statInsightMockHigh, statInsightMockLow],
};
