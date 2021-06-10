import { StatInsight } from '../../Models/GameData';
import { checkType } from './utils';

export const statInsightMapper = (object: any): StatInsight => {
	checkType<StatInsight>(object, 'name', 'string');
	checkType<StatInsight>(object, 'statName', 'string');
	checkType<StatInsight>(object, 'successMessage', 'string');
	checkType<StatInsight>(object, 'minValue', 'number');

	return {
		name: object?.name,
		statName: object?.statName,
		successMessage: object?.successMessage,
		minValue: object?.minValue,
	};
};
