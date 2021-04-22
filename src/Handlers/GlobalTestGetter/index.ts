import { find, isNil } from 'lodash';
import { IEvent, IGlobalTest } from '../../Models/GameData';
import { ISessionData } from '../../Models/AppModels';

const getGlobalTest = (sessionData: ISessionData, query: Partial<IEvent>): IGlobalTest => {
	const currentSession = sessionData.globaltestSet;
	const displayTest = find(currentSession, c => c.name === query.eventName);
	if (!isNil(displayTest)) {
		return displayTest;
	} else {
		throw new EvalError('Missing data');
	}
};

export default getGlobalTest;
