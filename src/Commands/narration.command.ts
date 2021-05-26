import { BaseCommand } from '../Models/CommandModels';
import { optionalParamsDefault } from './utils';

export const narrationCommand: BaseCommand = {
	name: 'narration',
	description: 'Display a narration to a channel',
	default_permission: true,
	options: [
		{
			name: 'title',
			description: 'name of the narration',
			type: 3,
			...optionalParamsDefault,
		},
	],
};
