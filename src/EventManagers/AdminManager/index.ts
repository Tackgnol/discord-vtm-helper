import { narrationRichEmbed, npcRichEmbed, playerRichEmbed, statInsightRichEmbed } from '../../Common/RichEmbeds';

import { settings } from '../../config/settings';
import {
	isObject,
	validateAddFacts,
	validateAddNarration,
	validateAddNPC,
	validateAddPlayer,
	validateAddStatInsight,
} from './validators';
import { trim } from 'lodash';
import { Message, TextChannel } from 'discord.js';
import { IStat } from '../..//Models/GameData';
import { errorName } from '../../Common/Errors/FirebaseError';

export class AdminManager {
	constructor(private channel: TextChannel, private message?: Message) {
		this.message = message;
		this.channel = channel;
	}

	async addPlayer(value = '') {
		const addPlayerRegex = /\[([^\]]+)\].*\[([^\]]+)\].*\[([^\]]+)\]/g;
		const parsed = addPlayerRegex.exec(value);
		let statArray: IStat[] = [];
		if (!parsed || parsed.length < 4) {
			this.message &&
				this.message.author.send('Invalid input, was expecting [player discord name][player discord id][statistics input]');
		} else {
			const errorArray = validateAddPlayer(parsed);
			const name = parsed[1];
			const id = parsed[2];
			const stats = parsed[3];
			if (errorArray.length >= 1) {
				this.message && this.message.author.send(errorArray.toString());
			} else if (isObject(stats)) {
				const onlyStatsRegex = /{([\w+:\d, ?]+[\w+:\d]{1})}/g;
				const matchStats = onlyStatsRegex.exec(stats);
				const onlyStats = matchStats ? matchStats[1].split(',') : [];
				statArray = onlyStats.map(stat => {
					const split = stat.split(':');
					return { name: split[0], value: +split[1] };
				});
			} else {
				const { statList } = settings;
				const statValues = stats.split(',');
				for (let i = 0; i < statValues.length; i++) {
					const statName = statList[i] ? statList[i] : '';
					const statValue = statValues[i] ? statValues[i] : 0;
					statArray.push({ name: statName, value: +statValue });
				}
			}
			const result = await global.service.AddPlayer(name, id, statArray);
			if (result) {
				this.message && this.message.author.send('New player added successfully', playerRichEmbed(name, id, statArray));
			} else {
				this.message && this.message.author.send('Something went wrong while saving your character...');
			}
		}
	}

	async addNPC(value = '') {
		const addNPCRegex = /\[(\w+)\].*\[(\w+)\].*\[(.+)\]\[(\w.+)\]/g;
		const parsed = addNPCRegex.exec(value);
		if (!parsed || parsed.length < 5) {
			this.message &&
				this.message.author.send('Invalid input, was expecting [npc name][npc call name][npc image][npc description]');
		} else {
			const errorArray = validateAddNPC(parsed);
			if (errorArray.length > 0) {
				this.message && this.message.author.send(errorArray.toString());
				return;
			}
			const name = parsed[1];
			const callName = parsed[2];
			const image = parsed[3];
			const description = parsed[4];
			const result = await global.service.AddNPC(name, callName, image, description);
			if (result) {
				this.message && this.message.author.send('Successfully added a npc:', npcRichEmbed(result, true));
			} else {
				this.message && this.message.author.send('Something went wrong while saving your npc...');
			}
		}
	}

	async addFactsToNPCs(value = '') {
		const addFactRegex = /\[(\w+)\]\[([\d+,]+\d+)\]\[(.+)\]/g;
		const parsed = addFactRegex.exec(value);
		if (!parsed || parsed.length < 4) {
			this.message && this.message.author.send('Invalid input was expecting [npc call name][player discord ids][fact list]');
		} else {
			const errorArray = validateAddFacts(parsed);
			if (errorArray.length > 0) {
				this.message && this.message.author.send(errorArray.toString());
				return;
			}
			const callName = parsed[1];
			const playerList = parsed[2] ? parsed[2].split(',').map(p => trim(p)) : [];
			const factList = parsed[3] ? parsed[3].split(',').map(f => trim(f)) : [];
			for (const p of playerList) {
				await global.service.AddFactsToNPC(p, callName, factList);
			}
		}
	}

	async addNarrationEvent(value = '') {
		const addNarrationRegex = /\[(\w+)\]\[(.+)\]\[(.+)\]/g;
		const parsed = addNarrationRegex.exec(value);
		if (!parsed || parsed.length < 4) {
			this.message &&
				this.message.author.send('Invalid input was expecting [event call name][image to display][Event description]');
		} else {
			const errorArray = validateAddNarration(parsed);
			if (errorArray.length > 0) {
				this.message && this.message.author.send(errorArray.toString());
				return;
			}
			const callName = parsed[1];
			const image = parsed[2];
			const description = parsed[3];
			const result = await global.service.AddNarration(callName, image, description);
			if (result) {
				this.message &&
					this.message.author.send('Successfully added event:', narrationRichEmbed(result.narrationText, result.image));
			} else {
				return null;
			}
		}
	}

	async addStatInsight(value = '') {
		const addStatInsightRegex = /\[([A-Za-z]+)\]\[([A-Za-z]+)\]\[(\d)\]\[([A-Za-z ,;'"\\s]+[.?!]?)\]/g;
		const parsed = addStatInsightRegex.exec(value);
		if (!parsed || parsed.length < 5) {
			this.message &&
				this.message.author.send('Invalid input was expecting [event call name][Stat to check][stat value][Success message]');
		} else {
			const errorArray = validateAddStatInsight(parsed);
			if (errorArray.length > 0) {
				this.message && this.message.author.send(errorArray.toString());
				return;
			}
			const eventName = parsed[1];
			const statName = parsed[2];
			const statValue = +parsed[3];
			const successMessage = parsed[4];
			const result = await global.service.AddStatInsight(eventName, statName, statValue, successMessage);
			if (result) {
				this.message &&
					this.message.author.send('Successfully added event:', statInsightRichEmbed(statName, +statValue, successMessage));
			} else {
				return null;
			}
		}
	}

	async addGlobalTest(value = '') {
		const addGlobalTestRegex = /\[([\w\d ]+)\]\[([aA-zZ0-9 .,?!]+)\]\[(true|false)\]\[([aA-zZ0-9 .,?!]+)\]\[(({\w+: ?\d ?, ?\w+: ?"[aA-zZ0-9 !?,.]+" ?}, )+({\w+:\d ?, ?\w+:? "[aA-zZ0-9 !?,.]+" ?}))\]/g;
		const parsed = addGlobalTestRegex.exec(value);
		if (!parsed || parsed.length < 6) {
			this.message &&
				this.message.author.send(
					'Invalid input was expecting [event call name][Test message][true or false][Message to display before the result][options for results: {minResult:value, resultMessage: "message for the player that achives this result" }]'
				);
		} else {
			const eventName = parsed[1];
			const testMessage = parsed[2];
			const shortCircuit = parsed[3];
			const replyPrefix = parsed[4];
			const options = parsed[5];
			const optionRegex = /(minResult: ?\d, ?resultMessage: ?"[aA-zZ !?,.]+" ?)/g;
			const messageRegex = /"(.+)"/g;
			const optionsParsed = options.match(optionRegex);
			const optionsArray = optionsParsed?.map(o => {
				const split = o.split(',');
				const minResult = split[0].replace('minResult:', '').trim();
				const messageRegexResult = split[1].match(messageRegex);
				const message = messageRegexResult ? messageRegexResult[0] : '';
				return {
					minResult: +minResult,
					resultMessage: message,
				};
			});

			global.service
				.AddGlobalTest(eventName, testMessage, Boolean(shortCircuit), replyPrefix, optionsArray ?? [])
				.then(() => {
					this.message && this.message.author.send('Successfully added event:');
				})
				.catch((e: Error) => {
					if (e.name === errorName) {
						this.message && this.message.author.send('Failed to add event, please try again later');
					} else {
						this.message && this.message.author.send();
					}
				});
		}
	}

	async assignAdminToChannel() {
		global.service
			.AssignGameAdmin(this.message?.author.id ?? '', this.channel.id, '216a9908-2766-42cc-be08-ea717593447a')
			.then(() => {
				this.channel.send('Congrats you are now an admin!');
			});
	}
}
