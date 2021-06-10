import { Stat } from '../../Models/GameData';
import { checkType } from './utils';

export const statisticsMapper = (object: any): Stat => {
	checkType<Stat>(object, 'name', 'string');
	checkType<Stat>(object, 'value', 'number');
	return {
		name: object?.name,
		value: object?.value,
	};
};
