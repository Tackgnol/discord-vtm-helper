import InvalidInputError, { FirebaseError } from '../../Common/Errors';
import { Game, GameQuery, SessionData } from '../../Models/AppModels';
import firebase, { firestore } from 'firebase';
import { Auth } from '../../config/access';
import {
	GlobalTest,
	Narration,
	NPC,
	Player,
	PlayerNPCKnowledge,
	Stat,
	StatInsight,
	VersionOption,
} from '../../Models/GameData';
import { find, findIndex, first, get, uniq } from 'lodash';
import { IService } from '../IService';
import DocumentData = firebase.firestore.DocumentData;
import { Channel } from 'discord.js';
import { settings } from '../../config/settings';

class FirebaseService implements IService {
	private games: firestore.CollectionReference<firestore.DocumentData>;
	private npcs: firestore.CollectionReference<firestore.DocumentData>;

	constructor() {
		const db = firebase.initializeApp({ ...Auth.firebase }).firestore();
		this.games = db.collection('games');
		this.npcs = db.collection('npcs');
	}

	async AssignEventToMessage(messageId: string, gameInfo: GameQuery): Promise<void> {
		const query = await this.games.where('id', '==', gameInfo.gameId).get();
		const queryData = get(query, 'docs[0]');

		if (!queryData) {
			throw new FirebaseError('Game data unavailable');
		}
		const game = queryData.data();
		const channelIndex = findIndex(game.channels, (c: Channel) => c.id === String(gameInfo.channelId));
		if (channelIndex === -1) {
			throw new FirebaseError('Channel not found');
		}
		let objectToQuery = '';
		switch (gameInfo.eventType) {
			case settings.subPrefixes.globalTest:
				objectToQuery = 'globaltestSet';
				break;
			case settings.subPrefixes.narration:
				objectToQuery = 'narrationSet';
				break;
			default:
				throw new InvalidInputError('This is not a channel message');
		}

		if (!game.channels[channelIndex][objectToQuery]) {
			throw new FirebaseError('No events in this category');
		}

		const eventToEditIndex = game.channels[channelIndex][objectToQuery].findIndex(
			(o: GlobalTest | Narration) => o.name === gameInfo.eventName
		);

		if (eventToEditIndex === -1) {
			throw new InvalidInputError('Event of this name does not exists');
		}
	}
	async GetPlayer(playerId: string, gameId: string): Promise<Player> {
		const game = await this.games.where('id', '==', gameId).get();
		const playerData = get(game, 'docs[0]');

		if (!playerData) {
			throw new FirebaseError('Player data unavailable');
		}
		const object = playerData.data();
		return find(object.players, (p: Player) => p.id === String(playerId));
	}

	async GetEvents(channelId: string, gameId: string): Promise<SessionData> {
		const game = await this.games.where('id', '==', gameId).get();
		const gameData = get(game, 'docs[0]');
		if (!gameData) {
			throw new FirebaseError('Could not fetch gamedata');
		}
		const object = gameData.data();
		return find(object.channels, (c: SessionData) => c.channelId === String(channelId));
	}

	async GetUserChannels(userId: string): Promise<Game[]> {
		const gamesQuery = await this.games.where('adminId', '==', userId).get();
		const games = gamesQuery.docs.map(g => g.data());

		return <Game[]>games;
	}

	async AddPlayer(name: string, id: string, statArray: Stat[], gameId: string): Promise<Player> {
		const game = await this.games.where('id', '==', gameId).get();
		const gameData = game.docs[0].data();
		if (find(gameData.players, (p: Player) => p.id === id)) {
			throw new Error('This player already exists');
		}
		const newGamePlayers = [...gameData.players, { discordUserName: name, id: id, statisticsSet: statArray }];
		gameData.players = newGamePlayers;
		return this.games
			.doc(game.docs[0].id)
			.set(gameData)
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
		const npcData = npcs.docs.map(n => n.data());
		const npcExists = findIndex(npcData, (n: DocumentData) => n.callName === callName) !== -1;
		if (npcExists) {
			throw new FirebaseError(`NPC of this callname allready exists! Callname was: ${callName}`);
		} else {
			const npcObject = {
				gameId: gameId,
				name: name,
				image: image,
				description: description,
				callName: callName,
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
		const gameData = game ? game.docs[0].data() : null;
		let npcToUpdate: DocumentData = {};

		if (!gameData) {
			throw new FirebaseError('No game data available');
		}

		const { players } = gameData;
		const playerIndex = findIndex(players, (p: Player) => p.id === playerId);
		if (playerIndex === -1) {
			throw new FirebaseError('Player not found');
		}
		let knownNPCPosition = findIndex(players[playerIndex].npcSet, (n: PlayerNPCKnowledge) => n.npc.callName === npc);
		if (knownNPCPosition === -1) {
			const npcs = await this.npcs.where('gameId', '==', gameId).get();
			const npcData = npcs ? npcs.docs.map(n => n.data()) : null;
			const dbNPC = find(npcData, (n: NPC) => n.callName === npc);
			if (dbNPC) {
				npcToUpdate = <DocumentData>dbNPC;
				players[playerIndex].npcs = [...players[playerIndex].npcs, npcToUpdate];
				knownNPCPosition = findIndex(players[playerIndex].npcSet, (n: PlayerNPCKnowledge) => n.npc.callName === npc);
			}
		} else {
			npcToUpdate = players[playerIndex].npcSet[knownNPCPosition];
		}
		const knownFacts = npcToUpdate.facts ?? [];
		players[playerIndex].npcSet[knownNPCPosition].facts = uniq([...knownFacts, ...facts]);
		gameData.players = players;
		return this.games
			.doc(game.docs[0].id)
			.set(gameData)
			.then(() => {
				return <NPC>npcToUpdate;
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
		const gameData = game ? game.docs[0].data() : null;
		if (!gameData) {
			throw new FirebaseError('Game data not found');
		}

		const channelIndex = findIndex(gameData.channels, (c: SessionData) => c.channelId === channelId);
		if (channelIndex === -1) {
			throw new FirebaseError('Channel not found');
		}
		const channel = gameData.channels[channelIndex];
		const narrationEvents = channel.narrationeventSet ? channel.narrationeventSet : {};
		const newNarrationEvent = { name, image, narrationText };
		channel.narrationSet = [...narrationEvents, newNarrationEvent];
		gameData.channels[channelIndex] = channel;
		return this.games
			.doc(game.docs[0].id)
			.set(gameData)
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
		const gameData = game ? game.docs[0].data() : null;
		if (!gameData) {
			throw new FirebaseError('Game data not found');
		}

		const channelIndex = findIndex(gameData.channels, (c: Partial<SessionData>) => c.channelId === channelId);
		if (channelIndex === -1) {
			throw new FirebaseError('Channel not found');
		}
		const channel = gameData.channels[channelIndex];
		const statInsightEvents = channel.statinsightSet ? channel.statinsightSet : {};
		const newInsightEvent = { name, statName: stat, minValue: value, successMessage: message };
		channel.statinsightSet = [...statInsightEvents, newInsightEvent];
		gameData.channels[channelIndex] = channel;
		return this.games
			.doc(game.docs[0].id)
			.set(gameData)
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
		globaltestoptionSet: VersionOption[],
		gameId: string,
		channelId: string
	): Promise<GlobalTest> {
		const game = await this.games.where('id', '==', gameId).get();
		const gameData = game ? game.docs[0].data() : null;
		if (!gameData) {
			throw new FirebaseError('Game data not found');
		}

		const channelIndex = findIndex(gameData.channels, (c: Partial<SessionData>) => c.channelId === channelId);
		if (channelIndex === -1) {
			throw new FirebaseError('Channel not found');
		}

		const channel = gameData.channels[channelIndex];
		const globaltestEvents = channel.globaltestSet ? channel.globaltestSet : {};
		const newGlobalTestEvent: GlobalTest = { name, testMessage: message, shortCircuit, replyPrefix, globaltestoptionSet };
		channel.globaltestSet = [...globaltestEvents, newGlobalTestEvent];
		gameData.channels[channelIndex] = channel;
		return this.games
			.doc(game.docs[0].id)
			.set(gameData)
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
		const gameData = first(game.docs)?.data() as Game;
		const isChannelRegistered = gameData.channels.find(c => c.channelId === channelId) != null;
		if (isChannelRegistered) {
			if (gameData.adminId !== playerId) {
				throw new Error('This channel already has an admin');
			} else {
				return new Promise<SessionData>(resolve => {
					resolve(gameData.channels.find(c => c.channelId === channelId) ?? newChannel);
				});
			}
		} else {
			gameData.channels.push(newChannel);
			return this.games
				.doc(game.docs[0].id)
				.set(gameData)
				.then(() => newChannel)
				.catch(e => {
					throw new FirebaseError(e);
				});
		}
	}
}

export default FirebaseService;
