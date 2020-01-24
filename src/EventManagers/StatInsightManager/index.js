const TurndownService = require('turndown');
const {isNil, isEmpty, find, get} = require('lodash');
const settings = require('../../../config/settings')

class StatInsightManager {
	constructor(message, channel) {
		this.channel = channel;
		this.message = message;
	}

	async checkStat(statName, minValue, successMessage) {
		let players;
		const messageChanel = this.channel;
		if (messageChanel.type === 'text') {
			if (settings.eventSource === 'offline') {
				players = require('../../Resources/playerToStat.json');
			} else {
				const {ApolloClient} = require('apollo-boost');
				const GET_CHANNEL_PLAYERS = require('../../GraphQL/GET_CHANNEL_PLAYERS');
				const {createHttpLink} = require('apollo-link-http');
				const {InMemoryCache} = require('apollo-cache-inmemory');
				const fetch = require('node-fetch');
				const apolloClient = new ApolloClient({
					link: createHttpLink({uri: 'http://localhost:8000/graphql', fetch: fetch}),
					cache: new InMemoryCache(),
				});
				const graphQLQuery = await apolloClient.query({
					query: GET_CHANNEL_PLAYERS,
				});
				const foundChannel = find(get(graphQLQuery, 'data.allChannels'), ed => ed.discordId === this.channel.id);
				players = get(foundChannel, 'game.playerSet');
			}
			const channelMembers = messageChanel.members;
			if (!isEmpty(channelMembers)) {
				channelMembers.forEach(m => {
					const thisPlayer = find(players, p => m.user.username === p.discordUserName);
					const statValue = thisPlayer && find(thisPlayer.statisticsSet, s => s.name === statName);

					if (!isNil(statValue) && statValue.value >= minValue) {
						const turndownService = new TurndownService()
						const markdown = turndownService.turndown(successMessage)
						m.send(`(${statName}:${statValue.value}) ${markdown}`);
					}
				});
			}
		}
		return;
	}
}

module.exports = StatInsightManager;
