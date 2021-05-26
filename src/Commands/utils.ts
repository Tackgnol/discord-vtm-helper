import { isEqual } from 'lodash';
import { ApplicationCommand, ApplicationCommandOption, BaseCommand } from '../Models/CommandModels';

export const optionalParamsDefault = { choices: undefined, options: undefined, required: true };

export const toApplicationCommand = (response: string): ApplicationCommand[] => {
	const commands: ApplicationCommand[] = [];
	const json = parseOutput(response);
	if (!Array.isArray(json)) {
		const command = parseCommand(json, 0);
		const commandOptions = command?.options?.map((o: any) => parseCommandOption(o, 0));
		if (command) {
			commands.push({ ...command, options: commandOptions });
		}
	} else {
		for (let i = 0; i < json.length; i++) {
			const command = parseCommand(json[i], i);
			const commandOptions: ApplicationCommandOption[] = json[i]?.options?.map((o: any) => parseCommandOption(o, i));
			if (command) {
				commands.push({ ...command, options: commandOptions });
			}
		}
	}
	return commands;
};

export const compareCommands = (localCommand: BaseCommand, apiCommand?: ApplicationCommand): boolean => {
	const optionDiff = isEqual(localCommand.options, apiCommand?.options ?? []);
	return (
		localCommand.name === apiCommand?.name &&
		localCommand.description === apiCommand?.description &&
		localCommand.default_permission === localCommand.default_permission &&
		optionDiff
	);
};

export const parseCommand = (command: any, index: number): ApplicationCommand => {
	if (!command?.id) {
		throw new Error(`Id missing on command at index: ${index}`);
	}

	if (!command?.application_id) {
		throw new Error(`Application id missing on command at index: ${index}`);
	}

	if (!command?.name) {
		throw new Error(`Name missing on command at index: ${index}`);
	}

	if (!command?.description) {
		throw new Error(`Description missing on command at index: ${index}`);
	}

	return {
		id: command.id,
		application_id: command.application_id,
		name: command.name,
		description: command.description,
		default_permission: command.default_permission ?? true,
	};
};

const parseCommandOption = (option: any, commandIndex: number): ApplicationCommandOption => {
	if (typeof option.type === 'undefined') {
		throw new Error(`Type missing at option at command ${commandIndex}`);
	}

	if (typeof option.name === 'undefined') {
		throw new Error(`Name missing  at command ${commandIndex}`);
	}

	if (typeof option.description === 'undefined') {
		throw new Error(`Description missing at command ${commandIndex}`);
	}

	if (Array.isArray(option.choices)) {
		option.choices.forEach((o: any) => {
			if (typeof o?.name !== 'string') {
				throw new Error(`Invalid name at choice on command ${commandIndex}`);
			}

			if (typeof o.value !== 'string' && typeof o.value !== 'number') {
				throw new Error(`Invalid value at choice on command ${commandIndex}`);
			}
		});
	}
	return {
		type: option.type,
		name: option.name,
		description: option.description,
		options: option?.options?.map((o: any) => parseCommandOption(o.options, commandIndex)) ?? undefined,
		choices: option?.choices ?? undefined,
		required: option?.required ?? false,
	};
};

const parseOutput = (input: any): object => {
	let res: object;
	try {
		res = JSON.parse(input);
	} catch {
		res = input;
	}
	return res;
};

export const validateName = (name: string) => {
	const regex = /^[\w-]{1,32}$/;
	return regex.test(name);
};
