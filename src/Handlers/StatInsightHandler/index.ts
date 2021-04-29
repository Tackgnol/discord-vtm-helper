import { find, get, isNil } from 'lodash';
import { IEvent, IStatInsight } from '../../Models/GameData';
import { InvalidInputError } from '../../Common/Errors/InvalidInputError';

const getStatInsight = (sessionData: any, query: Partial<IEvent>): IStatInsight => {
	const currentSession = get(sessionData, 'statinsightSet');
	const displayTest = find(currentSession, c => c.name === query.eventName);
	if (!isNil(displayTest)) {
		return displayTest;
	} else {
		throw new InvalidInputError('Test not found!');
	}
};

export default getStatInsight;
