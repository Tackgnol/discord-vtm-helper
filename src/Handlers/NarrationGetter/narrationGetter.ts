import { find, get, isNil } from 'lodash';
import { IEvent, INarration } from '../../Models/GameData';
import { InvalidInputError } from '../../Common/Errors/InvalidInputError';
import { ISessionData } from '../../Models/AppModels';

const getNarration = (sessionData: ISessionData, query: Partial<IEvent>): INarration => {
	const currentSession = get(sessionData, 'narrationSet');
	const narrationPiece = find(currentSession, c => c.name === query.eventName);
	if (!isNil(narrationPiece)) {
		return narrationPiece;
	} else {
		throw new InvalidInputError('Narration not found!');
	}
};

export default getNarration;
