import { find, get, isNil } from 'lodash';
import { IEvent, Narration } from '../../Models/GameData';
import { InvalidInputError } from '../../Common/Errors/InvalidInputError';
import { SessionData } from '../../Models/AppModels';

const getNarration = (sessionData: SessionData, query: Partial<IEvent>): Narration => {
	const currentSession = get(sessionData, 'narrationSet');
	const narrationPiece = find(currentSession, c => c.name === query.eventName);
	if (!isNil(narrationPiece)) {
		return narrationPiece;
	} else {
		throw new InvalidInputError('Narration not found!');
	}
};

export default getNarration;
