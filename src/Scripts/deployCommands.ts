import fetch, { Response } from 'node-fetch';
import { settings } from '../config/settings';
import { Auth } from '../config/access';
import { ApplicationCommand, BaseCommand } from '../Models/CommandModels';
import { compareCommands, toApplicationCommand, validateName } from '../Commands/utils';
import { commandList } from '../config/commandList';
import { deleteOptions, getOptions, patchOptions, postOptions } from './requests';
import { check, crossMark, plus, stop, up } from '../Common/console.icons';

let code = 0;
const update = async () => {
	const request = await fetch(`${settings.urls.baseDiscordUrl}/${Auth.appId}/commands`, getOptions());
	if (request.status !== 200) {
		throw new Error(`Fetch of commands failed: ${request.status} - ${request.statusText}`);
	}
	const commandsToAdd: BaseCommand[] = [];
	const commandsToDelete: ApplicationCommand[] = [];
	const commandsToUpdate: ApplicationCommand[] = [];
	const object = JSON.parse(await request.text());
	const apiCommands: ApplicationCommand[] = toApplicationCommand(object);

	const localCommands = commandList;

	console.info(
		'\x1b[42m',
		`Found ${apiCommands.length} commands on the discord server, ${localCommands.length} in the repository`,
		'\x1b[0m'
	);
	for (const localCommand of localCommands) {
		if (validateName(localCommand.name)) {
			const command = apiCommands.find(c => c.name === localCommand.name);
			if (!command) {
				console.warn(`${plus} ${localCommand.name} not found on the discord server will attempt to add it...\n`);
				commandsToAdd.push(localCommand);
			} else {
				if (!compareCommands(localCommand, command)) {
					console.warn(`${up} ${localCommand.name}, definition has changed will attempt to update it...`);
					commandsToUpdate.push({ ...localCommand, id: command.id, application_id: command.application_id });
				} else {
					console.info(`${check} ${localCommand.name} command unchanged`);
				}
			}
		} else {
			console.error(
				`Command name: ${localCommand.name} does not match the requirements, Command names must be lower-case and match the regular expression ^[\\w-]{1,32}$`
			);
			code = 1;
		}
	}

	for (const apiCommand of apiCommands) {
		if (!localCommands.find(c => c.name === apiCommand.name)) {
			console.warn(`${crossMark} ${apiCommand.name}, is not defined in the repository will attempt to delete it...`);
			commandsToDelete.push(apiCommand);
		}
	}

	commandsToAdd.length && (await addCommands(commandsToAdd));
	commandsToUpdate.length && (await updateCommands(commandsToUpdate));
	commandsToDelete.length && (await deleteCommands(commandsToDelete));
};

const addCommands = async (commands: BaseCommand[]) => {
	const results = await Promise.all(
		commands.map(async c => {
			const request = postOptions(c);
			return fetch(`${settings.urls.baseDiscordUrl}/${Auth.appId}/commands`, request);
		})
	);
	await processResults(results, 201, 'Add');
};

const updateCommands = async (commands: ApplicationCommand[]) => {
	const results = await Promise.all(
		commands.map(async c => {
			const request = patchOptions(c);
			return fetch(`${settings.urls.baseDiscordUrl}/${Auth.appId}/commands/${c.id}`, request);
		})
	);
	await processResults(results, 200, 'Update');
};

const deleteCommands = async (commands: ApplicationCommand[]) => {
	const results = await Promise.all(
		commands.map(async c => {
			const request = deleteOptions(c);
			return fetch(`${settings.urls.baseDiscordUrl}/${Auth.appId}/commands/${c.id}`, request);
		})
	);
	await processResults(results, 204, 'Delete');
};

const processResults = async (results: Response[], okCode: number, action?: 'Add' | 'Update' | 'Delete') => {
	let icon: string;
	switch (action) {
		case 'Add':
			icon = plus;
			break;
		case 'Update':
			icon = up;
			break;
		case 'Delete':
			icon = crossMark;
			break;
		default:
			icon = '';
	}
	for (const result of results) {
		if (result.status === okCode) {
			const response = await result.text();
			const command = toApplicationCommand(response)[0];
			console.info(`${icon} Action: ${action} succeeded for ${command.name} with id ${command.id}`);
		} else {
			console.error(
				`${stop} Error while working on command, ${result.status} - ${result.statusText}. ${
					action ? 'action type: ' + action : ''
				}`
			);
			code = 1;
		}
	}
};

update().then(() => {
	process.exit(code);
});
