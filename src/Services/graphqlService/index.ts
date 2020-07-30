import { ApolloClient, NormalizedCacheObject } from 'apollo-boost';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'node-fetch';
import { settings } from '../../config/settings';
import GET_CHANNELS from '../../GraphQL/Queries/GET_CHANNELS';
import GET_NPCS from '../../GraphQL/Queries/GET_NPCS';
import { find, get } from 'lodash';
import { IGame, ISessionData } from '../../Models/AppModels';
import GET_PLAYER from '../../GraphQL/Queries/GET_PLAYER';
import { IGlobalTest, INarration, INPC, IPlayer, IStat, IStatInsight, IVersionOption } from '../../Models/GameData';
import { GraphQLError } from '../../Common/Errors/GraphQLError';
import { IService } from '../IService';
import ADD_GLOBAL_TEST from '../../GraphQL/Mutations/ADD_GLOBAL_TEST';
import ADD_NPC from '../../GraphQL/Mutations/ADD_NPC';
import ADD_NARRATION from '../../GraphQL/Mutations/ADD_NARRATION';
import ADD_PLAYER from '../../GraphQL/Mutations/ADD_PLAYER';
import ADD_STAT_INSIGHT from '../../GraphQL/Mutations/ADD_STAT_INSIGHT';

class GraphqlService implements IService {
	private apolloClient: ApolloClient<NormalizedCacheObject>;
	constructor() {
		this.apolloClient = new ApolloClient({
			link: createHttpLink({ uri: settings.onlineSourceUrl, fetch: fetch }),
			cache: new InMemoryCache(),
		});
	}

	async GetPlayer(playerId: string): Promise<IPlayer> {
		const graphQLQuery = this.apolloClient.query<IPlayer>({
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

	async GetEvents(channelId: string): Promise<ISessionData> {
		const graphQLQuery = await this.apolloClient.query<ISessionData>({
			query: GET_CHANNELS,
		});
		return find(get(graphQLQuery, 'data.allChannels'), ed => ed.discordId === channelId);
	}

	AddFactsToNPC(playerId: string, npc: string, facts: string[]): Promise<INPC> {
		throw new GraphQLError(`Not supported in graphql`);
	}

	AddGlobalTest(
		name: string,
		testMessage: string,
		shortCircuit: boolean,
		replyPrefix: string,
		optionList: IVersionOption[]
	): Promise<IGlobalTest> {
		return this.apolloClient
			.mutate<IGlobalTest>({
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

	AddNPC(name: string, callName: string, image: string, description: string): Promise<Omit<INPC, 'facts'>> {
		return this.apolloClient
			.mutate<INPC>({
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

	AddNarration(name: string, image: string, narrationText: string): Promise<INarration> {
		return this.apolloClient
			.mutate<INarration>({
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

	AddPlayer(name: string, id: string, statArray: IStat[]): Promise<IPlayer> {
		return this.apolloClient
			.mutate<IPlayer>({
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

	AddStatInsight(name: string, stat: string, value: number, message: string): Promise<IStatInsight> {
		return this.apolloClient
			.mutate<IStatInsight>({
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

	GetUserChannels(userId: string): Promise<IGame[]> {
		return Promise.resolve([]);
	}

	AssignGameAdmin(playerId: string, channelId: string, gameId: string): Promise<ISessionData> {
		throw new GraphQLError('Unimplemented');
	}
}

export default GraphqlService;
