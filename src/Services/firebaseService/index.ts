import { FirebaseError } from '../../Common/Errors';
import { Game, SessionData } from '../../Models/AppModels';
import firebase, { firestore } from 'firebase';
import { Auth } from '../../config/access';
import { GlobalTest, Narration, NPC, Option, Player, Stat, StatInsight } from '../../Models/GameData';
import { find, findIndex, uniq } from 'lodash';
import { IService } from '../IService';
import { gameMapper } from '../Mappers/game.mapper';
import { npcMapper } from '../Mappers/npc.mapper';
import DocumentData = firebase.firestore.DocumentData;

class FirebaseService implements IService {
	private games: firestore.CollectionReference<firestore.DocumentData>;
	private npcs: firestore.CollectionReference<firestore.DocumentData>;
	constructor() {
		const db = firebase.initializeApp({ ...Auth.firebase }).firestore();
		this.games = db.collection('games');
		this.npcs = db.collection('npcs');
	}

	async GetPlayer(playerId: string, gameId: string): Promise<Player> {
		const game = await this.games.where('id', '==', gameId).get();
		const playerData = this.firstOrUndefined(game.docs);

		if (!playerData) {
			throw new FirebaseError('Player data unavailable');
		}
		const mappedGame = gameMapper(playerData.data());
		const player = find(mappedGame.players, (p: Player) => p.id === String(playerId));
		if (!player) {
			throw new FirebaseError('Player not found!');
		}
		return player;
	}

	async GetEvents(channelId: string, gameId: string): Promise<SessionData> {
		const game = await this.games.where('id', '==', gameId).get();
		const gameData = this.firstOrUndefined(game.docs);
		if (!gameData) {
			throw new FirebaseError('Could not fetch gamedata');
		}
		const mappedGame = gameMapper(gameData.data());

		const gameSession = find(mappedGame.channels, (c: SessionData) => c.channelId === String(channelId));
		if (!gameSession) {
			throw new FirebaseError('Game session data not found');
		}
		return gameSession;
	}

	async GetUserChannels(userId: string): Promise<Game[]> {
		const gamesQuery = await this.games.where('adminId', '==', userId).get();
		return gamesQuery.docs.map(g => gameMapper(g.data()));
	}

	async AddPlayer(name: string, id: string, statArray: Stat[], gameId: string): Promise<Player> {
		const game = await this.games.where('id', '==', gameId).get();
		const gameData = this.firstOrUndefined(game.docs);
		if (!gameData) {
			throw new FirebaseError('Could not fetch gamedata');
		}
		const mappedGame = gameMapper(gameData.data());
		if (find(mappedGame.players, (p: Player) => p.id === id)) {
			throw new Error('This player already exists');
		}
		const newPlayer: Player = {
			discordUserName: name,
			id,
			npcSet: [],
			statisticsSet: statArray,
		};
		const newGamePlayers = [...mappedGame.players, newPlayer];
		mappedGame.players = newGamePlayers;
		return this.games
			.doc(game.docs[0].id)
			.set(mappedGame)
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
		const npcs = await this.npcs.where('gameId', '==', gameId).get();
		const npcData = npcs.docs.map(n => npcMapper(n.data()));
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
		const game = await this.games.where('id', '==', gameId).get();
		const npcs = await this.npcs.where('gameId', '==', gameId).get();
		const gameData = this.firstOrUndefined(game.docs);
		const npcData = npcs.docs.map(n => npcMapper(n.data()));
		let npcToUpdate: NPC;
		if (npcData.length === 0) {
			throw new FirebaseError('No NPCs found');
		}

		if (!gameData) {
			throw new FirebaseError('No game data available');
		}

		const mappedGame = gameMapper(gameData.data());

		if (!mappedGame) {
			throw new FirebaseError('No game data available');
		}

		const { players } = mappedGame;
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
		mappedGame.players = players;
		return this.games
			.doc(gameData.id)
			.set(mappedGame)
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
		const game = await this.games.where('id', '==', gameId).get();
		const gameData = this.firstOrUndefined(game.docs);
		if (!gameData) {
			throw new FirebaseError('Game data not found');
		}

		const mappedGame = gameMapper(gameData.data());

		const channelIndex = findIndex(mappedGame.channels, (c: SessionData) => c.channelId === channelId);
		if (channelIndex === -1) {
			throw new FirebaseError('Channel not found');
		}
		const channel = mappedGame.channels[channelIndex];
		const narrationEvents = channel.narrationSet ? channel.narrationSet : [];
		const newNarrationEvent = { name, image, narrationText };
		channel.narrationSet = [...narrationEvents, newNarrationEvent];
		mappedGame.channels[channelIndex] = channel;
		return this.games
			.doc(gameData.id)
			.set(mappedGame)
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
		const game = await this.games.where('id', '==', gameId).get();
		const gameData = this.firstOrUndefined(game.docs);
		if (!gameData) {
			throw new FirebaseError('Game data not found');
		}

		const mappedGame = gameMapper(gameData.data());

		const channelIndex = findIndex(mappedGame.channels, (c: Partial<SessionData>) => c.channelId === channelId);
		if (channelIndex === -1) {
			throw new FirebaseError('Channel not found');
		}
		const channel = mappedGame.channels[channelIndex];
		const statInsightEvents = channel.statInsightSet ? channel.statInsightSet : [];
		const newInsightEvent = { name, statName: stat, minValue: value, successMessage: message };
		channel.statInsightSet = [...statInsightEvents, newInsightEvent];
		mappedGame.channels[channelIndex] = channel;
		return this.games
			.doc(gameData.id)
			.set(mappedGame)
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
		const game = await this.games.where('id', '==', gameId).get();
		const gameData = this.firstOrUndefined(game.docs);
		if (!gameData) {
			throw new FirebaseError('Game data not found');
		}

		const mappedGame = gameMapper(gameData.data());

		const channelIndex = findIndex(mappedGame.channels, (c: Partial<SessionData>) => c.channelId === channelId);
		if (channelIndex === -1) {
			throw new FirebaseError('Channel not found');
		}

		const channel = mappedGame.channels[channelIndex];
		const globaltestEvents = channel.globaltestSet ? channel.globaltestSet : [];
		const newGlobalTestEvent: GlobalTest = { name, testMessage: message, shortCircuit, replyPrefix, globaltestoptionSet };
		channel.globaltestSet = [...globaltestEvents, newGlobalTestEvent];
		mappedGame.channels[channelIndex] = channel;
		return this.games
			.doc(gameData.id)
			.set(mappedGame)
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
		const game = await this.games.where('id', '==', gameId).get();
		const gameData = this.firstOrUndefined(game.docs);
		if (!gameData) {
			throw new FirebaseError('Game data not found');
		}
		const mappedGame = gameMapper(gameData.docs());

		const isChannelRegistered = mappedGame.channels.find(c => c.channelId === channelId) != null;
		if (isChannelRegistered) {
			if (mappedGame.adminId !== playerId) {
				throw new Error('This channel already has an admin');
			} else {
				return new Promise<SessionData>(resolve => {
					resolve(mappedGame.channels.find(c => c.channelId === channelId) ?? newChannel);
				});
			}
		} else {
			mappedGame.channels.push(newChannel);
			return this.games
				.doc(game.docs[0].id)
				.set(mappedGame)
				.then(() => newChannel)
				.catch(e => {
					throw new FirebaseError(e);
				});
		}
	}

	private firstOrUndefined(array: DocumentData[]): DocumentData | undefined {
		return array.length === 0 ? undefined : array[0];
	}
}

export default FirebaseService;
