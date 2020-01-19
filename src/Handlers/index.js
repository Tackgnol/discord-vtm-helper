const { get, find } = require('lodash');

const { subPrefixes } = require('../../config/settings.json');
const GlobaTestHandler = require('./GlobalTestHandler');
const StatInsightHandler = require('./StatInsightHandler');
const FreeFormMultiMessageHandler = require('./FreeFormMultiMessageHandler');
const MultiMessageHandler = require('./DefinedMultiMessageHandler');
const NarrationHandler = require('./NarrationHandler');

const channelToSession = require('../Resources/channelToSession.json');
const sessionData = require('../Resources/events/');

const globalHandler = (channel, query, message, client = null) => {
	const queryType = query.type;
	const sessionId = get(
		find(channelToSession, c => c.id === +channel.id),
		'session'
	);
	const currentSession = sessionData[sessionId];
	let handler;
	switch (queryType) {
	case subPrefixes.globalTest:
		handler = new GlobaTestHandler(currentSession, message, query, channel);
		break;
	case subPrefixes.statInsight:
		handler = new StatInsightHandler(currentSession, message, query, channel);
		break;
	case subPrefixes.messageMultiplePlayers:
		handler = new FreeFormMultiMessageHandler(
			currentSession,
			message,
			query,
			channel
		);
		break;
	case subPrefixes.multiMessenger:
		handler = new MultiMessageHandler(currentSession, message, query);
		break;
	case subPrefixes.narration:
		handler = new NarrationHandler(currentSession, message, query, channel, client);
		break;
	default:
		return;
	}
	handler.handle();
};

module.exports = globalHandler;
