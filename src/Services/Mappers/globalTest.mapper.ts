import { GlobalTest, Option } from '../../Models/GameData';

import { optionMapper } from './option.mapper';
import { checkType } from './utils';

export const globalTestMapper = (object: any): GlobalTest => {
	checkType<GlobalTest>(object, 'name', 'string');
	checkType<GlobalTest>(object, 'shortCircuit', 'boolean');
	checkType<GlobalTest>(object, 'replyPrefix', 'string');
	checkType<GlobalTest>(object, 'testMessage', 'string');

	if (!Array.isArray(object?.globaltestoptionSet)) {
		throw new Error('Invalid globaltestoptionSet property');
	}

	if (object.globaltestoptionSet.length === 0) {
		throw new Error('Global test options cannot be empty!');
	}

	const options: Option[] = [];
	for (let i = 0; i < object.globaltestoptionSet.length; i++) {
		options.push(optionMapper(object.globaltestoptionSet[i]));
	}

	return {
		name: object?.name,
		shortCircuit: object?.shortCircuit,
		testMessage: object?.testMessage,
		globaltestoptionSet: options,
		replyPrefix: object?.replyPrefix,
	};
};
