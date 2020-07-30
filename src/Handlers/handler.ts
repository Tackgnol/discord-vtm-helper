import { Message, TextChannel } from 'discord.js';
import { IEvent } from '../Models/GameData';

import { settings } from '../config/settings';

import GlobaTestHandler from './GlobalTestHandler';

import StatInsightHandler from './StatInsightHandler';

import { FreeFormMessageMultiplePlayersHandler } from './FreeFormMultiMessageHandler';

import MultiMessageHandler from './DefinedMultiMessageHandler';

import NarrationHandler from './NarrationHandler';

import NPCHandler from './NPCHandler';

import AdminHandler from './AdminHandler';

const globalHandler = async (channel: TextChannel, query: Partial<IEvent>, message?: Message) => {
	let eventData;
	const queryType = query.type;
	const { subPrefixes } = settings;
	let handler;
	switch (queryType) {
		case subPrefixes.globalTest:
			eventData = await global.service.GetEvents(channel.id);
			handler = new GlobaTestHandler(eventData, query, channel, message);
			break;
		case subPrefixes.statInsight:
			eventData = await global.service.GetEvents(channel.id);
			handler = new StatInsightHandler(eventData, query, channel);
			break;
		case subPrefixes.messageMultiplePlayers:
			eventData = await global.service.GetEvents(channel.id);
			handler = new MultiMessageHandler(eventData, query, channel, message);
			break;
		case subPrefixes.multiMessenger:
			eventData = await global.service.GetEvents(channel.id);
			handler = new MultiMessageHandler(eventData, query, channel, message);
			break;
		case subPrefixes.narration:
			eventData = await global.service.GetEvents(channel.id);
			handler = new NarrationHandler(eventData, query, channel, message);
			break;
		case subPrefixes.npcs:
			if (message?.author.id) {
				eventData = await global.service.GetPlayer(message?.author.id);
				handler = new NPCHandler(eventData, query, message);
			}
			break;
		case subPrefixes.admin:
			handler = new AdminHandler(eventData, query, channel, message);
			break;
		default:
			return;
	}
	if (handler) {
		handler.handle();
	}
};

export default globalHandler;
