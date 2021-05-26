import { BaseCommand } from '../Models/CommandModels';
import { optionalParamsDefault } from './utils';

export const globalTestInitCommand: BaseCommand = {
	name: 'global-test',
	description: 'Start a global test on the channel',
	default_permission: true,
	options: [
		{
			name: 'title',
			description: 'Name of the test',
			type: 3,
			...optionalParamsDefault,
		},
	],
};

export const globalTestValueCommand: BaseCommand = {
	name: 'test-result',
	description: 'Get the result of the latest global test on the channel',
	default_permission: true,
	options: [
		{
			name: 'result',
			description: 'Put your result here',
			type: 4,
			...optionalParamsDefault,
		},
	],
};
