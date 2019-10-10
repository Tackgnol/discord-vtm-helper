const { get, find } = require('lodash');

const { subPrefixes } = require('../../config/settings.json');
const GlobaTestHandler = require('./GlobalTestHandler');
const StatInsightHandler = require('./StatInsightHandler');
const MessageMultiplePlayersHandler = require('./MessageMultiplePlayersHandler');
const MultiMessageHandler = require('./MultiMessageHandler');
const NarrationHandler = require('./NarrationHandler');

const channelToSession = require('../Resources/channelToSession.json');
const sessionData = require('../Resources/events/');

const globalHandler = (channelId, query, message) => {
	const queryType = query.type;

	const sessionId = get(
		find(channelToSession, c => c.id === +channelId),
		'session'
	);
	const currentSession = sessionData[sessionId];
	let handler;
	switch (queryType) {
	case subPrefixes.globalTest:
		handler = new GlobaTestHandler(currentSession, message, query);
		break;
	case subPrefixes.statInsight:
		handler = new StatInsightHandler(currentSession, message, query);
		break;
	case subPrefixes.messageMultiplePlayers:
		handler = new MessageMultiplePlayersHandler(
			currentSession,
			message,
			query
		);
		break;
	case subPrefixes.multiMessenger:
		handler = new MultiMessageHandler(currentSession, message, query);
		break;
	case subPrefixes.narration:
		handler = new NarrationHandler(currentSession, message,query);
		break;
	default:
		return;
	}
	handler.handle();
};

module.exports = globalHandler;
