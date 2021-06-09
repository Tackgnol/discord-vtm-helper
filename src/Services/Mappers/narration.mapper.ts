import { Narration } from '../../Models/GameData';
import { checkType } from './utils';

export const narrationMapper = (object: any): Narration => {
	checkType<Narration>(object, 'name', 'string');
	checkType<Narration>(object, 'image', 'string');
	checkType<Narration>(object, 'narrationText', 'string');

	return {
		narrationText: object?.narrationText,
		image: object?.image,
		name: object?.name,
	};
};
