import { globalTestRichEmbedInit, narrationRichEmbed, npcRichEmbed, playerRichEmbed, statInsightRichEmbed } from '../../Common';
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
import { IStat } from '../../Models/GameData';
import { errorName, InvalidInputError } from '../../Common/Errors';
import { IReply, ReplyType } from '../../Models/AppModels';
import { MessageEmbed } from 'discord.js';

export class AdminManager {
	async fireEvent(eventName: string, value: string, gameId: string, channelId: string, authorId: string): Promise<IReply> {
		const {
			addPlayer,
			addNPC,
			addFact,
			removePlayer,
			addGlobalTest,
			addStatInsight,
			addNarration,
			assignAdmin,
		} = settings.subPrefixes.adminSubCommands;
		let result: MessageEmbed | string | null;
		switch (eventName) {
			case addPlayer:
				result = await this.addPlayer(value, gameId);
				break;
			case addNPC:
				result = await this.addNPC(value, gameId);
				break;
			case addFact:
				result = await this.addFactsToNPCs(value, gameId);
				break;
			case removePlayer:
				throw Error('Unimplemented');
			case addGlobalTest:
				result = await this.addGlobalTest(value, channelId, gameId);
				break;
			case addStatInsight:
				result = await this.addStatInsight(value, channelId, gameId);
				break;
			case addNarration:
				result = await this.addNarrationEvent(value, channelId, gameId);
				break;
			case assignAdmin:
				result = await this.assignAdminToChannel(authorId, channelId);
				break;
			default:
				throw new InvalidInputError('Invalid admin command!');
		}
		if (!result) {
			throw new InvalidInputError('No reply available');
		}
		return { type: ReplyType.Personal, value: result };
	}

	private async addPlayer(value = '', channelId: string) {
		const addPlayerRegex = /\[([^\]]+)\].*\[([^\]]+)\].*\[([^\]]+)\]/g;
		const parsed = addPlayerRegex.exec(value);
		let statArray: IStat[] = [];
		if (!parsed || parsed.length < 4) {
			return 'Invalid input, was expecting [player discord name][player discord id][statistics input]';
		} else {
			const errorArray = validateAddPlayer(parsed);
			const name = parsed[1];
			const id = parsed[2];
			const stats = parsed[3];
			if (errorArray.length >= 1) {
				return errorArray.toString();
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
			const result = await global.service.AddPlayer(name, id, statArray, channelId);
			if (result) {
				return playerRichEmbed(name, id, statArray);
			} else {
				return 'Something went wrong while saving your character...';
			}
		}
	}

	private async addNPC(value = '', gameId: string) {
		const addNPCRegex = /\[(\w+)\].*\[(\w+)\].*\[(.+)\]\[(\w.+)\]/g;
		const parsed = addNPCRegex.exec(value);
		if (!parsed || parsed.length < 5) {
			return 'Invalid input, was expecting [npc name][npc call name][npc image][npc description]';
		} else {
			const errorArray = validateAddNPC(parsed);
			if (errorArray.length > 0) {
				return errorArray.toString();
			}
			const name = parsed[1];
			const callName = parsed[2];
			const image = parsed[3];
			const description = parsed[4];
			const result = await global.service.AddNPC(name, callName, image, description, gameId);
			if (result) {
				return npcRichEmbed(result, true, true);
			} else {
				return 'Something went wrong while saving your npc...';
			}
		}
	}

	private async addFactsToNPCs(value = '', gameId: string) {
		const addFactRegex = /\[(\w+)\]\[([\d+,]+\d+)\]\[(.+)\]/g;
		const parsed = addFactRegex.exec(value);
		const results = [];
		if (!parsed || parsed.length < 4) {
			return 'Invalid input was expecting [npc call name][player discord ids][fact list]';
		} else {
			const errorArray = validateAddFacts(parsed);
			if (errorArray.length > 0) {
				return errorArray.toString();
			}
			const callName = parsed[1];
			const playerList = parsed[2] ? parsed[2].split(',').map(p => trim(p)) : [];
			const factList = parsed[3] ? parsed[3].split(',').map(f => trim(f)) : [];
			for (const p of playerList) {
				const result = await global.service.AddFactsToNPC(p, callName, factList, gameId);
				results.push(result);
			}
			return results.toString();
		}
	}

	private async addNarrationEvent(value = '', channelId: string, gameId: string) {
		const addNarrationRegex = /\[(\w+)\]\[(.+)\]\[(.+)\]/g;
		const parsed = addNarrationRegex.exec(value);
		if (!parsed || parsed.length < 4) {
			return 'Invalid input was expecting [event call name][image to display][Event description]';
		} else {
			const errorArray = validateAddNarration(parsed);
			if (errorArray.length > 0) {
				return errorArray.toString();
			}
			const callName = parsed[1];
			const image = parsed[2];
			const description = parsed[3];
			const result = await global.service.AddNarration(callName, image, description, channelId, gameId);
			if (result) {
				return narrationRichEmbed(result.narrationText, result.image, true);
			} else {
				return null;
			}
		}
	}

	private async addStatInsight(value = '', channelId: string, gameId: string) {
		const addStatInsightRegex = /\[([A-Za-z]+)\]\[([A-Za-z]+)\]\[(\d)\]\[([A-Za-z ,;'"\\s]+[.?!]?)\]/g;
		const parsed = addStatInsightRegex.exec(value);
		if (!parsed || parsed.length < 5) {
			return 'Invalid input was expecting [event call name][Stat to check][stat value][Success message]';
		} else {
			const errorArray = validateAddStatInsight(parsed);
			if (errorArray.length > 0) {
				return errorArray.toString();
			}
			const eventName = parsed[1];
			const statName = parsed[2];
			const statValue = +parsed[3];
			const successMessage = parsed[4];
			const result = await global.service.AddStatInsight(eventName, statName, statValue, successMessage, channelId, gameId);
			if (result) {
				return statInsightRichEmbed(statName, +statValue, successMessage, true);
			} else {
				return null;
			}
		}
	}

	private async addGlobalTest(value = '', channelId: string, gameId: string) {
		const addGlobalTestRegex = /\[([\w\d ]+)\]\[([aA-zZ0-9 .,?!]+)\]\[(true|false)\]\[([aA-zZ0-9 .,?!]+)\]\[(({\w+: ?\d ?, ?\w+: ?"[aA-zZ0-9 !?,.]+" ?}, )+({\w+:\d ?, ?\w+:? "[aA-zZ0-9 !?,.]+" ?}))\]/g;
		const parsed = addGlobalTestRegex.exec(value);
		if (!parsed || parsed.length < 6) {
			return 'Invalid input was expecting [event call name][Test message][true or false][Message to display before the result][options for results: {minResult:value, resultMessage: "message for the player that achives this result" }]';
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

			return global.service
				.AddGlobalTest(eventName, testMessage, Boolean(shortCircuit), replyPrefix, optionsArray ?? [], channelId, gameId)
				.then(() => {
					return globalTestRichEmbedInit(testMessage, true);
				})
				.catch((e: Error) => {
					if (e.name === errorName) {
						return 'This name already exists, specify a new one';
					} else {
						return 'Failed to add event';
					}
				});
		}
	}

	private async assignAdminToChannel(authorId: string, channelId: string) {
		return global.service
			.AssignGameAdmin(authorId, channelId, '216a9908-2766-42cc-be08-ea717593447a')
			.then(() => {
				return `Congrats you are now an admin of ${channelId}!`;
			})
			.catch(e => {
				return `Adding admin to channel failed\n${e}`;
			});
	}
}
