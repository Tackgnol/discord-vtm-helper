import { Collection, GuildMember } from 'discord.js';
import { IEvent } from '../Models/GameData';

import { settings } from '../config/settings';

import getGlobalTest from './GlobalTestGetter';

import getStatInsight from './StatInsightHandler';
import { getMultiMessage } from './DefinedMultiMessageHandler';

import getNarration from './NarrationGetter';
import { GlobalTestManager } from '../EventManagers';
import NarrationManager from '../EventManagers/NarrationManager';
import NPCManager from '../EventManagers/NPCManager/NPCManager';
import StatInsightManager from '../EventManagers/StatInsightManager';
import { AdminManager } from '../EventManagers';
import MultiMessageManager from '../EventManagers/MultiMessageManager';
import { IReply } from '../Models/AppModels';

class Handler {
	private globalTestManager: GlobalTestManager;
	private narrationManager: NarrationManager;
	private npcManager: NPCManager;
	private statInsightManager: StatInsightManager;
	private adminManager: AdminManager;
	private multiMessage: MultiMessageManager;

	constructor() {
		this.globalTestManager = new GlobalTestManager();
		this.narrationManager = new NarrationManager();
		this.npcManager = new NPCManager();
		this.statInsightManager = new StatInsightManager();
		this.adminManager = new AdminManager();
		this.multiMessage = new MultiMessageManager();
	}

	async handle(
		channelId: string,
		query: Partial<IEvent>,
		gameId: string,
		messageAuthor: string,
		channelMembers: Collection<string, GuildMember>,
		receivedValue?: number
	): Promise<IReply> {
		let eventData;
		const queryType = query.type;
		const { subPrefixes } = settings;
		switch (queryType) {
			case subPrefixes.globalTest:
				eventData = await global.service.GetEvents(channelId, gameId);
				const { testMessage, shortCircuit, replyPrefix, globaltestoptionSet } = getGlobalTest(eventData, query);
				return this.globalTestManager.performTest(testMessage, replyPrefix, globaltestoptionSet, shortCircuit, receivedValue);
			case subPrefixes.statInsight:
				eventData = await global.service.GetEvents(channelId, gameId);
				const { statName, successMessage, minValue } = getStatInsight(eventData, query);
				return this.statInsightManager.checkStat(statName, minValue, successMessage, gameId, channelMembers);
			case subPrefixes.messageMultiplePlayers:
				eventData = await global.service.GetEvents(channelId, gameId);
				const { userList, value } = getMultiMessage(eventData, query);
				return this.multiMessage.messageUsers(userList, channelMembers, value);
			case subPrefixes.narration:
				eventData = await global.service.GetEvents(channelId, gameId);
				const { narrationText, image } = getNarration(eventData, query);
				return this.narrationManager.displayNarration(narrationText, image);
			case subPrefixes.admin:
				return this.adminManager.fireEvent(query.eventName ?? '', query.value ?? '', gameId, channelId, messageAuthor);
			case subPrefixes.npcs:
				if (messageAuthor) {
					const { npcSet } = await global.service.GetPlayer(messageAuthor, gameId);
					return this.npcManager.handle(query.eventName ?? '', npcSet);
				}
				throw new EvalError('No Author supplied!');
			default:
				throw new EvalError('Unknown command!');
		}
	}
}

export default Handler;
