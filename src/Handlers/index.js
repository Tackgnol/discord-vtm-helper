const { subPrefixes } = require('../../config/settings.json');
const GlobaTestHandler = require('./GlobalTestHandler');
const StatInsightHandler = require('./StatInsightHandler');
const FreeFormMultiMessageHandler = require('./FreeFormMultiMessageHandler');
const MultiMessageHandler = require('./DefinedMultiMessageHandler');
const NarrationHandler = require('./NarrationHandler');
const NPCHandler = require('./NPCHandler');

const initializeService = require('../Services/index');
const setting = require('../../config/settings');

const globalHandler = async (channel, query, message) => {

	const serviceType = setting.eventSource;
	const service = initializeService(serviceType);
	let eventData;

	const queryType = query.type;

	let handler;
	switch (queryType) {
	case subPrefixes.globalTest:
		eventData = service.GetEvents(channel.id);
		handler = new GlobaTestHandler(eventData, message, query, channel);
		break;
	case subPrefixes.statInsight:
		eventData = service.GetEvents(channel.id);
		handler = new StatInsightHandler(eventData, message, query, channel);
		break;
	case subPrefixes.messageMultiplePlayers:
		eventData = service.GetEvents(channel.id);
		handler = new FreeFormMultiMessageHandler(
			eventData,
			message,
			query,
			channel
		);
		break;
	case subPrefixes.multiMessenger:
		eventData = service.GetEvents(channel.id);
		handler = new MultiMessageHandler(eventData, message, query);
		break;
	case subPrefixes.narration:
		eventData = service.GetEvents(channel.id);
		handler = new NarrationHandler(eventData, message, query, channel);
		break;
	case subPrefixes.npcs:
		eventData = service.GetPlayer(message.author.id);
		handler = new NPCHandler(eventData, message, query, channel);
		break;
	default:
		return;
	}
	handler.handle();
};

module.exports = globalHandler;
