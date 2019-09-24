const { subPrefixes } = require('../../config/settings.json');
const GlobaTestHandler = require('./GlobalTestHandler');
const StatInsightHandler = require('./StatInsightHandler');
const MessageMultiplePlayersHandler = require('./MessageMultiplePlayersHandler');
const MultiMessageHandler = require('./MultiMessageHandler');
const sessionData = require('../Resources/events/');

const globalHandler = (query, message, session) => {
	const queryType = query.type;
	const currentSession = sessionData[session];
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
	default:
		return;
	}
	handler.handle();
};

module.exports = globalHandler;
