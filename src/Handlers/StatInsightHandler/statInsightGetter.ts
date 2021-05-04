import { find, get, isNil } from 'lodash';
import { IEvent, IStatInsight } from '../../Models/GameData';
import { InvalidInputError } from '../../Common/Errors/InvalidInputError';
import { ISessionData } from '../../Models/AppModels';

const getStatInsight = (sessionData: ISessionData, query: Partial<IEvent>): IStatInsight => {
	const currentSession = get(sessionData, 'statInsightSet');
	const displayTest = find(currentSession, c => c.name === query.eventName);
	if (!isNil(displayTest)) {
		return displayTest;
	} else {
		throw new InvalidInputError('Test not found!');
	}
};

export default getStatInsight;
