import { Collection, GuildMember } from 'discord.js';
import { IEvent } from '../Models/GameData';

import { settings } from '../config/settings';
import getGlobalTest from './GlobalTestGetter/globalTestGetter';

import getStatInsight from './StatInsightHandler/statInsightGetter';
import { getMultiMessage } from './DefinedMultiMessageHandler';

import getNarration from './NarrationGetter/narrationGetter';
import { GlobalTestManager } from '../EventManagers';
import NarrationManager from '../EventManagers/NarrationManager/NarrationManager';
import NPCManager from '../EventManagers/NPCManager/NPCManager';
import { AdminManager } from '../EventManagers';
import MultiMessageManager from '../EventManagers/MultiMessageManager/MultiMessageManager';
import { IReply } from '../Models/AppModels';
import { InvalidInputError } from '../Common/Errors/InvalidInputError';
import { IService } from '../Services/IService';
import StatInsightManager from '../EventManagers/StatInsightManager/StatInsightManager';

class Handler {
	private globalTestManager: GlobalTestManager;
	private narrationManager: NarrationManager;
	private npcManager: NPCManager;
	private statInsightManager: StatInsightManager;
	private adminManager: AdminManager;
	private multiMessage: MultiMessageManager;

	constructor(private service: IService) {
		this.globalTestManager = new GlobalTestManager();
		this.narrationManager = new NarrationManager();
		this.npcManager = new NPCManager();
		this.statInsightManager = new StatInsightManager(service);
		this.adminManager = new AdminManager(service);
		this.multiMessage = new MultiMessageManager();
	}

	async handle(
		channelId: string,
		query: Partial<IEvent>,
		gameId: string,
		messageAuthor?: string,
		channelMembers?: Collection<string, GuildMember>
	): Promise<IReply> {
		let eventData;
		const queryType = query.type;
		const { subPrefixes } = settings;
		const memberList = channelMembers?.map(m => m.id) ?? [];
		const { value } = query;
		switch (queryType) {
			case subPrefixes.globalTest:
				eventData = await this.service.GetEvents(channelId, gameId);
				const { name, testMessage, shortCircuit, replyPrefix, globaltestoptionSet } = getGlobalTest(eventData, query);
				if (typeof value === 'undefined') {
					return this.globalTestManager.initTest(name, testMessage);
				}
				return this.globalTestManager.performTest(testMessage, replyPrefix, globaltestoptionSet, shortCircuit, value);
			case subPrefixes.statInsight:
				eventData = await this.service.GetEvents(channelId, gameId);
				const { statName, successMessage, minValue } = getStatInsight(eventData, query);
				return this.statInsightManager.checkStat(statName, minValue, successMessage, gameId, memberList);
			case subPrefixes.messageMultiplePlayers:
				eventData = await this.service.GetEvents(channelId, gameId);
				const { userList, message } = getMultiMessage(eventData, query);
				return this.multiMessage.messageUsers(userList, memberList, message);
			case subPrefixes.narration:
				eventData = await this.service.GetEvents(channelId, gameId);
				const { narrationText, image } = getNarration(eventData, query);
				return this.narrationManager.displayNarration(narrationText, image);
			case subPrefixes.admin:
				if (messageAuthor) {
					return this.adminManager.fireEvent(query.eventName ?? '', query.value ?? '', gameId, channelId, messageAuthor);
				}
				throw new InvalidInputError('Only Players can issue admin commands');
			case subPrefixes.npcs:
				if (messageAuthor) {
					const player = await this.service.GetPlayer(messageAuthor, gameId);
					if (!player) {
						throw new InvalidInputError('This player has no NPCs');
					}
					return this.npcManager.displayNPCInfo(query.eventName ?? '', player.npcSet);
				}
				throw new InvalidInputError('Message author not found');
			default:
				throw new InvalidInputError('Unknown command');
		}
	}
}

export default Handler;
