import { find, isNil } from 'lodash';
import { Event, GlobalTest } from '../../Models/GameData';
import { SessionData } from '../../Models/AppModels';
import { InvalidInputError } from '../../Common/Errors/InvalidInputError';

const getGlobalTest = (sessionData: SessionData, query: Partial<Event>): GlobalTest => {
	const currentSession = sessionData.globaltestSet;
	const displayTest = find(currentSession, c => c.name === query.eventName);
	if (!isNil(displayTest)) {
		return displayTest;
	} else {
		throw new InvalidInputError('Test not found!');
	}
};

export default getGlobalTest;
