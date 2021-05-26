import { BaseCommand } from '../Models/CommandModels';
import { optionalParamsDefault } from './utils';

export const statInsightCommand: BaseCommand = {
	name: 'stat-insight',
	description: 'Start a stat insight event for the players',
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
