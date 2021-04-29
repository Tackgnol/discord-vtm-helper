import { find, get, isNil } from 'lodash';
import { IEvent, IMultiUserMessage } from '../../Models/GameData';
import { InvalidInputError } from '../../Common/Errors/InvalidInputError';

export const getMultiMessage = (sessionData: any, query: Partial<IEvent>): IMultiUserMessage => {
	const currentSession = get(sessionData, 'multiMessage');
	const displayTest = find(currentSession, c => c.name === query.eventName);
	if (!isNil(displayTest)) {
		const { messageObject } = displayTest;
		return messageObject;
	} else {
		throw new InvalidInputError('Test not found!');
	}
};
