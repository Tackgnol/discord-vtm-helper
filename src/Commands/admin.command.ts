import { BaseCommand } from '../Models/CommandModels';
import { optionalParamsDefault } from './utils';

export const addNPCCommand: BaseCommand = {
	name: 'add-npc',
	description: 'Add a npc to the game',
	default_permission: true,
	options: [
		{
			name: 'display-name',
			description: 'Name to be shown to the players',
			type: 3,
			...optionalParamsDefault,
		},
		{
			name: 'call-name',
			description: 'Name to be used in contancia commands',
			type: 3,
			...optionalParamsDefault,
		},
		{
			name: 'image',
			description: 'Link to a NPC image, imgur works best',
			type: 3,
			...optionalParamsDefault,
		},
		{
			name: 'description',
			description: 'Describe the NPC',
			type: 3,
			...optionalParamsDefault,
		},
	],
};

export const addFactsCommand: BaseCommand = {
	name: 'add-fact',
	description: 'Add a fact to a NPC',
	default_permission: true,
	options: [
		{
			name: 'npc',
			description: 'Call name of the npc',
			type: 3,
			...optionalParamsDefault,
		},
		{
			name: 'facts',
			description: 'List of facts for that npc. Comma separated.',
			type: 3,
			...optionalParamsDefault,
		},
		{
			name: 'players',
			description: 'List of players (ids) privy to that fact. Comma separated',
			type: 3,
			...optionalParamsDefault,
		},
	],
};

export const addGlobalTestCommand: BaseCommand = {
	name: 'add-global-test',
	description: 'Add a global test',
	default_permission: true,
	options: [
		{
			name: 'name',
			description: 'Name of the test to be called upon (unique)',
			type: 3,
			...optionalParamsDefault,
		},
		{
			name: 'test-message',
			description: 'Message to show to your players.',
			type: 3,
			...optionalParamsDefault,
		},
		{
			name: 'short-circuit',
			description: 'Should the test only display only the highest value (true/false)',
			type: 5,
			...optionalParamsDefault,
		},
		{
			name: 'reply-prefix',
			description: 'Text to display for your players before the test result messages',
			type: 3,
			...optionalParamsDefault,
		},
		{
			name: 'options',
			description: 'List of test results and messages in a format: {minResult:0, resultMessage: "message qwr2"},...',
			type: 3,
			...optionalParamsDefault,
		},
	],
};

export const addPlayerCommand: BaseCommand = {
	name: 'add-player',
	description: 'Add a Player',
	default_permission: true,
	options: [
		{
			name: 'name',
			description: 'Player name',
			type: 3,
			...optionalParamsDefault,
		},
		{
			name: 'user',
			description: 'Discord user assigned to this player',
			type: 3,
			...optionalParamsDefault,
		},
		{
			name: 'stats-object',
			description: 'List of player statistics in a format {Occult:1,Investigation:2,Brawl:3,...}',
			type: 3,
			...optionalParamsDefault,
			required: false,
		},
		{
			name: 'stats-list',
			description: 'List of player statistics comma separated in a format 2,3,5,1,3 see docs for stat list',
			type: 3,
			...optionalParamsDefault,
			required: false,
		},
	],
};

export const addStatInsightCommand: BaseCommand = {
	name: 'add-stat-insight',
	description: 'Add a stat insight',
	default_permission: true,
	options: [
		{
			name: 'name',
			description: 'Name of the test to be called upon (unique)',
			type: 3,
			...optionalParamsDefault,
		},
		{
			name: 'stat',
			description: 'Name of the statistic (must match the stat in players)',
			type: 3,
			...optionalParamsDefault,
		},
		{
			name: 'value',
			description: 'Minimum value of the statistic to receive the message',
			type: 4,
			...optionalParamsDefault,
		},
		{
			name: 'message',
			description: 'Message to display if the statistic is equal or higher',
			type: 3,
			...optionalParamsDefault,
		},
	],
};

export const addNarrationCommand: BaseCommand = {
	name: 'add-narration',
	description: 'Add a narration',
	default_permission: true,
	options: [
		{
			name: 'name',
			description: 'Name of the test to be called upon (unique)',
			type: 3,
			...optionalParamsDefault,
		},
		{
			name: 'message',
			description: 'Narration to be displayed on the main channel',
			type: 3,
			...optionalParamsDefault,
		},
		{
			name: 'image',
			description: 'Image to display with the narration',
			type: 3,
			...optionalParamsDefault,
			required: false,
		},
	],
};

export const assignAdminCommand: BaseCommand = {
	name: 'assign-admin',
	description: 'Assign administration of the channel',
	default_permission: true,
	options: [
		{
			name: 'player',
			description: 'Player, if left blank will assign to you',
			type: 6,
			...optionalParamsDefault,
			required: false,
		},
	],
};
