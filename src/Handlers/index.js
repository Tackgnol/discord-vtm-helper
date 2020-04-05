const { get, find, isNil } = require('lodash');

const { subPrefixes } = require('../../config/settings.json');
const GlobaTestHandler = require('./GlobalTestHandler');
const StatInsightHandler = require('./StatInsightHandler');
const FreeFormMultiMessageHandler = require('./FreeFormMultiMessageHandler');
const MultiMessageHandler = require('./DefinedMultiMessageHandler');
const NarrationHandler = require('./NarrationHandler');
const NPCHandler = require('./NPCHandler');

const channelToSession = require('../../Resources/channelToSession.json');
const setting = require('../../config/settings');
const sessionData = setting.eventSource === 'offline' ? require('../../Resources/events/') : {};
const GET_CHANNELS = require('../GraphQL/GET_CHANNELS');
const GET_NPCS = require('../GraphQL/GET_NPCS');

const fetchData = async (channelId, query = null, variables = null) => {
	if (setting.eventSource === 'online') {
		const { ApolloClient } = require('apollo-boost');

		const { createHttpLink } = require('apollo-link-http');
		const { InMemoryCache } = require('apollo-cache-inmemory');
		const fetch = require('node-fetch');
		const apolloClient = new ApolloClient({
			link: createHttpLink({ uri: 'http://localhost:8000/graphql', fetch: fetch }),
			cache: new InMemoryCache(),
		});
		const graphQLQuery = await apolloClient.query({
			query: query,
			variables: variables,
		});
		return graphQLQuery;
	} else {
		return get(
			find(channelToSession, c => c.id === +channelId),
			'session'
		);

	}
};

const fetchEventInfo = (data, channelId) => {
	if (setting.eventSource === 'online') {
		return find(get(data, 'data.allChannels'), ed => ed.discordId === channelId);
	} else {
		return sessionData[data];
	}
};

const fetchNPCs = async (message, channel) => {
	const isOnline = setting.eventSource === 'online';
	let npcData;
	if (isOnline) {
		npcData = await fetchData(channel.id, GET_NPCS, { discordId: message.author.id });
		return get(npcData, 'data.player');
	} else {
		const playerName = message.author.username;

		const allPlayerData = require('../../Resources/players');

		const playerData = find(allPlayerData, p => p.discordUserName === playerName);
		if (!isNil(playerData)) {
			return playerData.npcSet;
		}
	}
};


const globalHandler = async (channel, query, message) => {

	const isOnline = setting.eventSource === 'online';
	let eventData;

	const queryType = query.type;

	let handler;
	switch (queryType) {
	case subPrefixes.globalTest:
		eventData = fetchEventInfo(await fetchData(channel.id, isOnline ? GET_CHANNELS : null), channel.id);
		handler = new GlobaTestHandler(eventData, message, query, channel);
		break;
	case subPrefixes.statInsight:
		eventData = fetchEventInfo(await fetchData(channel.id, isOnline ? GET_CHANNELS : null), channel.id);
		handler = new StatInsightHandler(eventData, message, query, channel);
		break;
	case subPrefixes.messageMultiplePlayers:
		eventData = fetchEventInfo(await fetchData(channel.id, isOnline ? GET_CHANNELS : null), channel.id);
		handler = new FreeFormMultiMessageHandler(
			eventData,
			message,
			query,
			channel
		);
		break;
	case subPrefixes.multiMessenger:
		eventData = fetchEventInfo(await fetchData(channel.id, isOnline ? GET_CHANNELS : null), channel.id);
		handler = new MultiMessageHandler(eventData, message, query);
		break;
	case subPrefixes.narration:
		eventData = fetchEventInfo(await fetchData(channel.id, isOnline ? GET_CHANNELS : null), channel.id);
		handler = new NarrationHandler(eventData, message, query, channel);
		break;
	case subPrefixes.npcs:
		eventData = await fetchNPCs(message, channel);
		handler = new NPCHandler(eventData, message, query, channel);
		break;
	default:
		return;
	}
	handler.handle();
};

module.exports = globalHandler;
