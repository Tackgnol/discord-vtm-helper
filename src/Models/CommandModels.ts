import { Snowflake } from 'discord.js';

export interface BaseCommand {
	name: string;
	description: string;
	options?: ApplicationCommandOption[];
	default_permission?: boolean;
}

export interface ApplicationCommand extends BaseCommand {
	id: Snowflake;
	application_id: Snowflake;
}
export interface ApplicationCommandOption {
	type: number;
	name: string;
	description: string;
	required?: boolean;
	choices?: ApplicationCommandOptionChoice[];
	options?: ApplicationCommandOption[];
}

export interface ApplicationCommandOptionChoice {
	name: string;
	value: string | number;
}
