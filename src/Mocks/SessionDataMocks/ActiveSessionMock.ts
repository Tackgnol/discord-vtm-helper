import { IActiveSession } from '../../Models/AppModels';
import { existingGTQueryWithoutValue } from '../QueryMocks/globalTestQueries';

export const activeSessionMock: IActiveSession = {
	channelId: '0',
	gameId: '0',
	prevCommand: existingGTQueryWithoutValue,
};
