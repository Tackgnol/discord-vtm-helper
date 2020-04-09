const { ApolloClient } = require('apollo-boost');

const { createHttpLink } = require('apollo-link-http');
const { InMemoryCache } = require('apollo-cache-inmemory');
const fetch = require('node-fetch');
const settings = require('../../../config/settings');
const GET_CHANNELS = require('../../GraphQL/GET_CHANNELS');
const GET_NPCS = require('../../GraphQL/GET_NPCS');
const { find, get } = require('lodash');

class GraphqlService {
	constructor() {
		this.apolloClient = new ApolloClient({
			link: createHttpLink({ uri: settings.onlineSourceUrl, fetch: fetch }),
			cache: new InMemoryCache(),
		});
	}

	async GetPlayer(playerId) {
		const graphQLQuery = await this.apolloClient.query({
			query: GET_NPCS,
			variables: { playerId: playerId },
		});
		return get(graphQLQuery, 'data.player');
	}

	async GetEvents(channelId) {
		const graphQLQuery = await this.apolloClient.query({
			query: GET_CHANNELS,
		});
		return find(get(graphQLQuery, 'data.allChannels'), ed => ed.discordId === channelId);
	}
}

module.exports = GraphqlService;
