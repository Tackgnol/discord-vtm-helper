import { find, get, isNil } from 'lodash';
import { IEvent, INarration } from '../../Models/GameData';
import { InvalidInputError } from '../../Common/Errors/InvalidInputError';

const getNarration = (sessionData: any, query: Partial<IEvent>): INarration => {
	const currentSession = get(sessionData, 'narrationeventSet');
	const narrationPiece = find(currentSession, c => c.name === query.eventName);
	if (!isNil(narrationPiece)) {
		return narrationPiece;
	} else {
		throw new InvalidInputError('Narration not found!');
	}
};

export default getNarration;
