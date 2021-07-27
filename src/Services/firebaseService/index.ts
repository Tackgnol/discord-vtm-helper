import { FirebaseError } from '../../Common/Errors';
import { Game, SessionData } from '../../Models/AppModels';
import firebase, { firestore } from 'firebase';
import { Auth } from '../../config/access';
import { GlobalTest, MessageTest, Narration, NPC, Option, Player, Stat, StatInsight } from '../../Models/GameData';
import { find, findIndex, uniq } from 'lodash';
import { IService } from '../IService';
import { gameMapper } from '../Mappers/game.mapper';
import { npcMapper } from '../Mappers/npc.mapper';
import { v4 } from 'uuid';
import DocumentData = firebase.firestore.DocumentData;
import { testMessageMapper } from '../Mappers/testMessage.mapper';

class FirebaseService implements IService {
	private games: firestore.CollectionReference<firestore.DocumentData>;
	private npcs: firestore.CollectionReference<firestore.DocumentData>;
	private testMessages: firestore.CollectionReference<firestore.DocumentData>;
	constructor() {
		const db = firebase.initializeApp({ ...Auth.firebase }).firestore();
		this.games = db.collection('games');
		this.npcs = db.collection('npcs');
		this.testMessages = db.collection('testMessage');
	}

	async GetPlayer(playerId: string, gameId: string): Promise<Player | undefined> {
		const { game } = await this.getGameById(gameId);
		return find(game.players, (p: Player) => p.id === String(playerId));
	}

	async GetEvents(channelId: string, gameId: string): Promise<SessionData> {
		const { game } = await this.getGameById(gameId);

		const gameSession = find(game.channels, (c: SessionData) => c.channelId === String(channelId));
		if (!gameSession) {
			throw new FirebaseError('Game session data not found');
		}
		return gameSession;
	}

	async GetUserChannels(userId: string): Promise<Game[]> {
		const gamesQuery = await this.games.where('adminId', '==', userId).get();
		return gamesQuery.docs.map(g => gameMapper(g.data()));
	}

	async AddPlayer(name: string, playerId: string, statArray: Stat[], gameId: string): Promise<Player> {
		const { game, id } = await this.getGameById(gameId);
		if (find(game.players, (p: Player) => p.id === playerId)) {
			throw new Error('This player already exists');
		}
		const newPlayer: Player = {
			discordUserName: name,
			id,
			npcSet: [],
			statisticsSet: statArray,
		};
		const newGamePlayers = [...game.players, newPlayer];
		game.players = newGamePlayers;
		return this.games
			.doc(id)
			.set(game)
			.then(() => {
				return newGamePlayers[newGamePlayers.length - 1];
			})
			.catch(e => {
				console.log(e);
				throw new FirebaseError(e);
			});
	}

	async AddNPC(
		name: string,
		callName: string,
		image: string,
		description: string,
		gameId: string
	): Promise<Omit<NPC, 'facts'>> {
		const npcData = await this.getNPCsByGameId(gameId);
		const npcExists = findIndex(npcData, (n: DocumentData) => n.callName === callName) !== -1;
		if (npcExists) {
			throw new FirebaseError(`NPC of this callname allready exists! Callname was: ${callName}`);
		} else {
			const npcObject: NPC = {
				name: name,
				image: image,
				description: description,
				callName: callName,
				gameId,
				facts: [],
			};
			return this.npcs
				.add(npcObject)
				.then(() => {
					return npcObject;
				})
				.catch(e => {
					console.log(e);
					throw new FirebaseError(e);
				});
		}
	}

	async AddFactsToNPC(playerId: string, npc: string, facts: string[], gameId: string): Promise<NPC> {
		const { game, id } = await this.getGameById(gameId);
		const npcData = await this.getNPCsByGameId(gameId);
		if (!game) {
			throw new FirebaseError('No game data available');
		}

		let npcToUpdate: NPC;
		const { players } = game;
		const playerIndex = findIndex(players, (p: Player) => p.id === playerId);
		if (playerIndex === -1) {
			throw new FirebaseError('Player not found');
		}
		let knownNPCPosition = findIndex(players[playerIndex].npcSet, (n: NPC) => n.callName === npc);
		if (knownNPCPosition === -1) {
			const dbNPC = find(npcData, (n: NPC) => n.callName === npc);
			if (dbNPC) {
				players[playerIndex].npcSet = [...players[playerIndex].npcSet, dbNPC];
				knownNPCPosition = findIndex(players[playerIndex].npcSet, (n: NPC) => n.callName === npc);
			}
		}
		npcToUpdate = players[playerIndex].npcSet[knownNPCPosition];
		const knownFacts = npcToUpdate.facts ?? [];
		players[playerIndex].npcSet[knownNPCPosition].facts = uniq([...knownFacts, ...facts]);
		game.players = players;
		return this.games
			.doc(id)
			.set(game)
			.then(() => {
				return npcToUpdate;
			})
			.catch(e => {
				console.log(e);
				throw new FirebaseError(e);
			});
	}

	async AddNarration(
		name: string,
		image: string,
		narrationText: string,
		channelId: string,
		gameId: string
	): Promise<Narration> {
		const { game, id } = await this.getGameById(gameId);

		const channelIndex = findIndex(game.channels, (c: SessionData) => c.channelId === channelId);
		if (channelIndex === -1) {
			throw new FirebaseError('Channel not found');
		}
		const channel = game.channels[channelIndex];
		const narrationEvents = channel.narrationSet ? channel.narrationSet : [];
		const newNarrationEvent = { name, image, narrationText };
		channel.narrationSet = [...narrationEvents, newNarrationEvent];
		game.channels[channelIndex] = channel;
		return this.games
			.doc(id)
			.set(game)
			.then(() => {
				return newNarrationEvent;
			})
			.catch(e => {
				console.log(e);
				throw new FirebaseError(e);
			});
	}

	async AddStatInsight(
		name: string,
		stat: string,
		value: number,
		message: string,
		channelId: string,
		gameId: string
	): Promise<StatInsight> {
		const { game, id } = await this.getGameById(gameId);

		const channelIndex = findIndex(game.channels, (c: Partial<SessionData>) => c.channelId === channelId);
		if (channelIndex === -1) {
			throw new FirebaseError('Channel not found');
		}
		const channel = game.channels[channelIndex];
		const statInsightEvents = channel.statInsightSet ? channel.statInsightSet : [];
		const newInsightEvent = { name, statName: stat, minValue: value, successMessage: message };
		channel.statInsightSet = [...statInsightEvents, newInsightEvent];
		game.channels[channelIndex] = channel;
		return this.games
			.doc(id)
			.set(game)
			.then(() => {
				return newInsightEvent;
			})
			.catch(e => {
				console.log(e);
				throw new FirebaseError(e);
			});
	}

	async AddGlobalTest(
		name: string,
		message: string,
		shortCircuit: boolean,
		replyPrefix: string,
		globaltestoptionSet: Option[],
		channelId: string,
		gameId: string
	): Promise<GlobalTest> {
		const { game, id } = await this.getGameById(gameId);

		const channelIndex = findIndex(game.channels, (c: Partial<SessionData>) => c.channelId === channelId);
		if (channelIndex === -1) {
			throw new FirebaseError('Channel not found');
		}

		const channel = game.channels[channelIndex];
		const globaltestEvents = channel.globaltestSet ? channel.globaltestSet : [];
		const newGlobalTestEvent: GlobalTest = { name, testMessage: message, shortCircuit, replyPrefix, globaltestoptionSet };
		channel.globaltestSet = [...globaltestEvents, newGlobalTestEvent];
		game.channels[channelIndex] = channel;
		return this.games
			.doc(id)
			.set(game)
			.then(() => {
				return <GlobalTest>newGlobalTestEvent;
			})
			.catch(e => {
				console.log(e);
				throw new FirebaseError(e);
			});
	}

	async AssignGameAdmin(playerId: string, channelId: string, gameId: string): Promise<SessionData> {
		const newChannel: SessionData = {
			channelId: channelId,
			statInsightSet: [],
			narrationSet: [],
			multiMessageSet: [],
			globaltestSet: [],
		};
		const { game, id } = await this.getGameById(gameId);

		const isChannelRegistered = game.channels.find(c => c.channelId === channelId) != null;
		if (isChannelRegistered) {
			if (game.adminId !== playerId) {
				throw new Error('This channel already has an admin');
			} else {
				return new Promise<SessionData>(resolve => {
					resolve(game.channels.find(c => c.channelId === channelId) ?? newChannel);
				});
			}
		} else {
			game.channels.push(newChannel);
			return this.games
				.doc(id)
				.set(game)
				.then(() => newChannel)
				.catch(e => {
					throw new FirebaseError(e);
				});
		}
	}

	async RemovePlayer(playerId: string, gameId: string): Promise<string> {
		const { game, id } = await this.getGameById(gameId);
		const playerIndex = findIndex(game.players, p => p.id === playerId);
		if (playerIndex === -1) {
			throw new FirebaseError('No player of this ID in game');
		}
		game.players = game.players.splice(playerIndex, 1);
		return this.games
			.doc(id)
			.set(game)
			.then(() => `Successfully removed player ${playerId}`)
			.catch(e => {
				throw new FirebaseError(e);
			});
	}

	async NewGame(admin: string, channelId: string): Promise<Game> {
		const game: Game = {
			adminId: admin,
			id: v4(),
			players: [],
			activeChannel: channelId,
			current: true,
			channels: [
				{
					channelId,
					statInsightSet: [],
					narrationSet: [],
					multiMessageSet: [],
					globaltestSet: [],
				},
			],
		};
		return this.games
			.add(game)
			.then(async g => {
				const newGame = await g.get();
				return gameMapper(newGame.data());
			})
			.catch(e => {
				throw new FirebaseError(e);
			});
	}

	async AssignActiveMessage(messageId: string, testCall: string, gameId: string): Promise<string> {
		return this.testMessages
			.add({ messageId, testCall, gameId })
			.then(() => {
				return 'Successfully added a record';
			})
			.catch(e => {
				throw new FirebaseError(e);
			});
	}

	private firstOrUndefined(array: DocumentData[]): DocumentData | undefined {
		return array.length === 0 ? undefined : array[0];
	}

	private async getGameById(gameId: string): Promise<{ game: Game; id: string }> {
		const query = await this.games.where('id', '==', gameId).get();
		const docs = this.firstOrUndefined(query?.docs);
		if (!docs) {
			throw new FirebaseError('Game not found!');
		}
		const game = gameMapper(docs.data());
		return { game, id: docs.id };
	}

	private async getNPCsByGameId(gameId: string): Promise<NPC[]> {
		const npcs = await this.npcs.where('gameId', '==', gameId).get();
		const npcData = npcs.docs.map(n => npcMapper(n.data()));
		if (npcData.length === 0) {
			throw new FirebaseError('No NPCs found');
		}
		return npcData;
	}

	async GetTestByMessageId(messageId: string): Promise<MessageTest> {
		const query = await this.testMessages.where('messageId', '==', messageId).get();
		const firstElement = this.firstOrUndefined(query.docs);
		if (!firstElement) {
			throw new FirebaseError('Test not found for this message');
		}
		return testMessageMapper(firstElement.data());
	}
}

export default FirebaseService;
