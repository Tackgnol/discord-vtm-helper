import { find, get, isNil } from 'lodash';
import { Event, StatInsight } from '../../Models/GameData';
import { InvalidInputError } from '../../Common/Errors/InvalidInputError';
import { SessionData } from '../../Models/AppModels';

const getStatInsight = (sessionData: SessionData, query: Partial<Event>): StatInsight => {
	const currentSession = get(sessionData, 'statInsightSet');
	const displayTest = find(currentSession, c => c.name === query.eventName);
	if (!isNil(displayTest)) {
		return displayTest;
	} else {
		throw new InvalidInputError('Test not found!');
	}
};

export default getStatInsight;
