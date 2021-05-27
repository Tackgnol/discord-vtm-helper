import { ActiveSession } from '../../Models/AppModels';
import { existingGTQueryWithoutValue } from '../QueryMocks/globalTestQueries';

export const activeSessionMock: ActiveSession = {
	channelId: '0',
	gameId: '0',
	prevCommand: existingGTQueryWithoutValue,
};
