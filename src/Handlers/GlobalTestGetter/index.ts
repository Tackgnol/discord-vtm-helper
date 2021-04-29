import { find, isNil } from 'lodash';
import { IEvent, IGlobalTest } from '../../Models/GameData';
import { ISessionData } from '../../Models/AppModels';
import { InvalidInputError } from '../../Common/Errors/InvalidInputError';

const getGlobalTest = (sessionData: ISessionData, query: Partial<IEvent>): IGlobalTest => {
	const currentSession = sessionData.globaltestSet;
	const displayTest = find(currentSession, c => c.name === query.eventName);
	if (!isNil(displayTest)) {
		return displayTest;
	} else {
		throw new InvalidInputError('Test not found!');
	}
};

export default getGlobalTest;
