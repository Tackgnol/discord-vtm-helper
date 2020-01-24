const { get, find } = require('lodash');

const { subPrefixes } = require('../../config/settings.json');
const GlobaTestHandler = require('./GlobalTestHandler');
const StatInsightHandler = require('./StatInsightHandler');
const FreeFormMultiMessageHandler = require('./FreeFormMultiMessageHandler');
const MultiMessageHandler = require('./DefinedMultiMessageHandler');
const NarrationHandler = require('./NarrationHandler');

const channelToSession = require('../Resources/channelToSession.json');
const setting = require('../../config/settings');
const sessionData = setting.eventSource === 'offline' ? require('../Resources/events/') : {};

const globalHandler = async (channel, query, message, client = null) => {
	let eventData;
	if (setting.eventSource === 'online') {
		const { ApolloClient } = require('apollo-boost');
		const GET_CHANNELS = require('../GraphQL/GET_CHANNELS');
		const { createHttpLink } = require('apollo-link-http');
		const { InMemoryCache } = require('apollo-cache-inmemory');
		const fetch = require('node-fetch');
		const apolloClient = new ApolloClient({
			link: createHttpLink({ uri: 'http://localhost:8000/graphql', fetch: fetch }),
			cache: new InMemoryCache(),
		});
		const graphQLQuery = await apolloClient.query({
			query: GET_CHANNELS,
		});
		eventData = find(get(graphQLQuery, 'data.allChannels'), ed => ed.discordId === channel.id);
	} else {
		const sessionId = get(
			find(channelToSession, c => c.id === +channel.id),
			'session'
		);
		eventData = sessionData[sessionId];
	}
	const queryType = query.type;

	let handler;
	switch (queryType) {
	case subPrefixes.globalTest:
		handler = new GlobaTestHandler(eventData, message, query, channel);
		break;
	case subPrefixes.statInsight:
		handler = new StatInsightHandler(eventData, message, query, channel);
		break;
	case subPrefixes.messageMultiplePlayers:
		handler = new FreeFormMultiMessageHandler(
			eventData,
			message,
			query,
			channel
		);
		break;
	case subPrefixes.multiMessenger:
		handler = new MultiMessageHandler(eventData, message, query);
		break;
	case subPrefixes.narration:
		handler = new NarrationHandler(eventData, message, query, channel, client);
		break;
	default:
		return;
	}
	handler.handle();
};

module.exports = globalHandler;
