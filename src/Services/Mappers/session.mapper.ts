import { SessionData } from '../../Models/AppModels';
import { checkType, mapArray } from './utils';
import { globalTestMapper } from './globalTest.mapper';
import { statInsightMapper } from './statInsight.mapper';
import { narrationMapper } from './narration.mapper';
import { multiMessageMapper } from './multiMessage.mapper';

export const sessionMapper = (object: any): SessionData => {
	checkType<SessionData>(object, 'channelId', 'string');
	return {
		globaltestSet: mapArray(object?.globaltestSet, globalTestMapper, false),
		statInsightSet: mapArray(object?.statInsightSet, statInsightMapper, false),
		narrationSet: mapArray(object?.narrationSet, narrationMapper, false),
		multiMessageSet: mapArray(object?.multiMessageSet, multiMessageMapper, false),
		channelId: object?.channelId,
	};
};
