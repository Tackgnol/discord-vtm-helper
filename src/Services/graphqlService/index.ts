import { ApolloClient, NormalizedCacheObject } from 'apollo-boost';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'node-fetch';
import { settings } from '../../config/settings';
import GET_CHANNELS from '../../GraphQL/Queries/GET_CHANNELS';
import { find, get } from 'lodash';
import { Game, SessionData } from '../../Models/AppModels';
import GET_PLAYER from '../../GraphQL/Queries/GET_PLAYER';
import { GlobalTest, Narration, NPC, Option, Player, Stat, StatInsight } from '../../Models/GameData';
import { GraphQLError } from '../../Common/Errors/GraphQLError';
import { IService } from '../IService';
import ADD_GLOBAL_TEST from '../../GraphQL/Mutations/ADD_GLOBAL_TEST';
import ADD_NPC from '../../GraphQL/Mutations/ADD_NPC';
import ADD_NARRATION from '../../GraphQL/Mutations/ADD_NARRATION';
import ADD_PLAYER from '../../GraphQL/Mutations/ADD_PLAYER';
import ADD_STAT_INSIGHT from '../../GraphQL/Mutations/ADD_STAT_INSIGHT';
import ADD_GAME from '../../GraphQL/Mutations/ADD_GAME';
import REMOVE_PLAYER from '../../GraphQL/Mutations/REMOVE_PLAYER';

class GraphqlService implements IService {
	private apolloClient: ApolloClient<NormalizedCacheObject>;
	constructor() {
		this.apolloClient = new ApolloClient({
			link: createHttpLink({ uri: settings.onlineSourceUrl, fetch: fetch }),
			cache: new InMemoryCache(),
		});
	}

	RemovePlayer(playerId: string, gameId: string): Promise<string> {
		return this.apolloClient
			.mutate<Game>({
				mutation: REMOVE_PLAYER,
				variables: { inputPlayerId: playerId, inputGame: gameId },
			})
			.then(r => {
				return `Successfully removed player ${playerId}`;
			})
			.catch(e => {
				throw new GraphQLError(e);
			});
	}
	NewGame(admin: string, channelId: string): Promise<Game> {
		return this.apolloClient
			.mutate<Game>({
				mutation: ADD_GAME,
				variables: { inputAdminId: admin, inputChannelId: channelId },
			})
			.then(r => {
				if (r.data) {
					return r.data;
				} else {
					throw new GraphQLError(`Failed to retrieve new npc data`);
				}
			});
	}

	async GetPlayer(playerId: string): Promise<Player> {
		const graphQLQuery = this.apolloClient.query<Player>({
			query: GET_PLAYER,
			variables: { playerId: playerId },
		});
		return graphQLQuery
			.then(r => {
				return r.data;
			})
			.catch(e => {
				throw new GraphQLError(`GraphQL player query failed for player: ${playerId}`);
			});
	}

	async GetEvents(channelId: string): Promise<SessionData> {
		const graphQLQuery = await this.apolloClient.query<SessionData>({
			query: GET_CHANNELS,
		});
		return find(get(graphQLQuery, 'data.allChannels'), ed => ed.discordId === channelId);
	}

	AddFactsToNPC(playerId: string, npc: string, facts: string[]): Promise<NPC> {
		throw new GraphQLError(`Not supported in graphql`);
	}

	AddGlobalTest(
		name: string,
		testMessage: string,
		shortCircuit: boolean,
		replyPrefix: string,
		optionList: Option[]
	): Promise<GlobalTest> {
		return this.apolloClient
			.mutate<GlobalTest>({
				mutation: ADD_GLOBAL_TEST,
				variables: { inputTest: { name, testMessage, shortCircuit, replyPrefix, optionList } },
			})
			.then(r => {
				if (r.data) {
					return r.data;
				} else {
					throw new GraphQLError(`Failed to retrieve new test data`);
				}
			})
			.catch(e => {
				throw new GraphQLError(`Failed to add Global test, \n${e}`);
			});
	}

	AddNPC(name: string, callName: string, image: string, description: string): Promise<Omit<NPC, 'facts'>> {
		return this.apolloClient
			.mutate<NPC>({
				mutation: ADD_NPC,
				variables: { inputNPC: { name, description, image } },
			})
			.then(r => {
				if (r.data) {
					return r.data;
				} else {
					throw new GraphQLError(`Failed to retrieve new npc data`);
				}
			})
			.catch(e => {
				throw new GraphQLError(`Failed to add new NPC, \n${e}`);
			});
	}

	AddNarration(name: string, image: string, narrationText: string): Promise<Narration> {
		return this.apolloClient
			.mutate<Narration>({
				mutation: ADD_NARRATION,
				variables: { inputNarration: { name, narrationText, image } },
			})
			.then(r => {
				if (r.data) {
					return r.data;
				} else {
					throw new GraphQLError(`Failed to retrieve new narration event data`);
				}
			})
			.catch(e => {
				throw new GraphQLError(`Failed to add new Narration event, \n${e}`);
			});
	}

	AddPlayer(name: string, id: string, statArray: Stat[]): Promise<Player> {
		return this.apolloClient
			.mutate<Player>({
				mutation: ADD_PLAYER,
				variables: { name, discordId: id, stats: statArray },
			})
			.then(r => {
				if (r.data) {
					return r.data;
				} else {
					throw new GraphQLError(`Failed to retrieve new narration event data`);
				}
			})
			.catch(e => {
				throw new GraphQLError(`Failed to add new Narration event, \n${e}`);
			});
	}

	AddStatInsight(name: string, stat: string, value: number, message: string): Promise<StatInsight> {
		return this.apolloClient
			.mutate<StatInsight>({
				mutation: ADD_STAT_INSIGHT,
				variables: { name, statName: stat, minValue: value, successMessage: message },
			})
			.then(r => {
				if (r.data) {
					return r.data;
				} else {
					throw new GraphQLError(`Failed to retrieve new narration event data`);
				}
			})
			.catch(e => {
				throw new GraphQLError(`Failed to add new Narration event, \n${e}`);
			});
	}

	GetUserChannels(userId: string): Promise<Game[]> {
		return Promise.resolve([]);
	}

	AssignGameAdmin(playerId: string, channelId: string, gameId: string): Promise<SessionData> {
		throw new GraphQLError('Unimplemented');
	}
}

export default GraphqlService;
