import { Option } from '../../Models/GameData';
import { checkType } from './utils';

export const optionMapper = (object: any): Option => {
	checkType<Option>(object, 'minResult', 'number');
	checkType<Option>(object, 'resultMessage', 'string');

	return {
		minResult: object?.minResult,
		resultMessage: object?.resultMessage,
	};
};
