import { BaseCommand } from '../Models/CommandModels';
import { optionalParamsDefault } from './utils';

export const npcCommand: BaseCommand = {
	name: 'npc',
	description: 'Display npc information',
	default_permission: true,
	options: [
		{
			name: 'type',
			description: 'Type of npc request',
			type: 3,
			...optionalParamsDefault,
			choices: [
				{ name: 'all', value: 'all' },
				{ name: 'npc', value: 'npc' },
			],
		},
		{
			name: 'npc-name',
			description: 'Name of NPC you wish to know about',
			type: 3,
			...optionalParamsDefault,
			required: false,
		},
	],
};
