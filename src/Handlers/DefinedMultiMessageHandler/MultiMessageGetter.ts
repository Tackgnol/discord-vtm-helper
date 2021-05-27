import { find, get, isNil } from 'lodash';
import { Event, MultiPlayerMessage } from '../../Models/GameData';
import { InvalidInputError } from '../../Common/Errors/InvalidInputError';
import { SessionData } from '../../Models/AppModels';

export const getMultiMessage = (sessionData: SessionData, query: Partial<Event>): MultiPlayerMessage => {
	const currentSession = get(sessionData, 'multiMessageSet');
	const displayTest = find(currentSession, c => c.name === query.eventName);
	if (!isNil(displayTest)) {
		return displayTest;
	} else {
		throw new InvalidInputError('Test not found!');
	}
};
