import { FirebaseError } from '../../Common/Errors';
import { IGame, ISessionData } from '../../Models/AppModels';
import firebase from 'firebase';
import { Auth } from '../../config/access';
import {
	IGlobalTest,
	INarration,
	INPC,
	IPlayer,
	IPlayerNPCKnowledge,
	IStat,
	IStatInsight,
	IVersionOption,
} from '../../Models/GameData';
import { find, findIndex, first, get, uniq } from 'lodash';
import { IService } from '../IService';
import DocumentData = firebase.firestore.DocumentData;
import firestore = firebase.firestore;

class FirebaseService implements IService {
	private games: firestore.CollectionReference<firestore.DocumentData>;
	private npcs: firestore.CollectionReference<firestore.DocumentData>;
	constructor() {
		const db = firebase.initializeApp({ ...Auth.firebase }).firestore();
		this.games = db.collection('games');
		this.npcs = db.collection('npcs');
	}

	async GetPlayer(playerId: string, gameId: string): Promise<IPlayer> {
		const game = await this.games.where('id', '==', gameId).get();
		const playerData = get(game, 'docs[0]');

		if (!playerData) {
			throw new FirebaseError('Player data unavailable');
		}
		const object = playerData.data();
		return find(object.players, (p: IPlayer) => p.id === String(playerId));
	}

	async GetEvents(channelId: string, gameId: string): Promise<ISessionData> {
		const game = await this.games.where('id', '==', gameId).get();
		const gameData = get(game, 'docs[0]');
		if (!gameData) {
			throw new FirebaseError('Could not fetch gamedata');
		}
		const object = gameData.data();
		return find(object.channels, (c: ISessionData) => c.channelId === String(channelId));
	}

	async GetUserChannels(userId: string): Promise<IGame[]> {
		const gamesQuery = await this.games.where('adminId', '==', userId).get();
		const games = gamesQuery.docs.map(g => g.data());

		return <IGame[]>games;
	}

	async AddPlayer(name: string, id: string, statArray: IStat[], gameId: string): Promise<IPlayer> {
		const game = await this.games.where('id', '==', gameId).get();
		const gameData = game.docs[0].data();
		if (find(gameData.players, (p: IPlayer) => p.id === id)) {
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
			.catch((e: string) => {
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
	): Promise<Omit<INPC, 'facts'>> {
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

	async AddFactsToNPC(playerId: string, npc: string, facts: string[], gameId: string): Promise<INPC> {
		const game = await this.games.where('id', '==', gameId).get();
		const gameData = game ? game.docs[0].data() : null;
		let npcToUpdate: DocumentData = {};

		if (!gameData) {
			throw new FirebaseError('No game data available');
		}

		const { players } = gameData;
		const playerIndex = findIndex(players, (p: IPlayer) => p.id === playerId);
		if (playerIndex === -1) {
			throw new FirebaseError('Player not found');
		}
		let knownNPCPosition = findIndex(players[playerIndex].npcSet, (n: IPlayerNPCKnowledge) => n.npc.callName === npc);
		if (knownNPCPosition === -1) {
			const npcs = await this.npcs.where('gameId', '==', gameId).get();
			const npcData = npcs ? npcs.docs.map(n => n.data()) : null;
			const dbNPC = find(npcData, (n: INPC) => n.callName === npc);
			if (dbNPC) {
				npcToUpdate = <DocumentData>dbNPC;
				players[playerIndex].npcs = [...players[playerIndex].npcs, npcToUpdate];
				knownNPCPosition = findIndex(players[playerIndex].npcSet, (n: IPlayerNPCKnowledge) => n.npc.callName === npc);
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
				return <INPC>npcToUpdate;
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
	): Promise<INarration> {
		const game = await this.games.where('id', '==', gameId).get();
		const gameData = game ? game.docs[0].data() : null;
		if (!gameData) {
			throw new FirebaseError('Game data not found');
		}

		const channelIndex = findIndex(gameData.channels, (c: ISessionData) => c.channelId === channelId);
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
	): Promise<IStatInsight> {
		const game = await this.games.where('id', '==', gameId).get();
		const gameData = game ? game.docs[0].data() : null;
		if (!gameData) {
			throw new FirebaseError('Game data not found');
		}

		const channelIndex = findIndex(gameData.channels, (c: Partial<ISessionData>) => c.channelId === channelId);
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
		globaltestoptionSet: IVersionOption[],
		gameId: string,
		channelId: string
	): Promise<IGlobalTest> {
		const game = await this.games.where('id', '==', gameId).get();
		const gameData = game ? game.docs[0].data() : null;
		if (!gameData) {
			throw new FirebaseError('Game data not found');
		}

		const channelIndex = findIndex(gameData.channels, (c: Partial<ISessionData>) => c.channelId === channelId);
		if (channelIndex === -1) {
			throw new FirebaseError('Channel not found');
		}

		const channel = gameData.channels[channelIndex];
		const globaltestEvents = channel.globaltestSet ? channel.globaltestSet : {};
		const newGlobalTestEvent: IGlobalTest = { name, testMessage: message, shortCircuit, replyPrefix, globaltestoptionSet };
		channel.globaltestSet = [...globaltestEvents, newGlobalTestEvent];
		gameData.channels[channelIndex] = channel;
		return this.games
			.doc(game.docs[0].id)
			.set(gameData)
			.then(() => {
				return <IGlobalTest>newGlobalTestEvent;
			})
			.catch(e => {
				console.log(e);
				throw new FirebaseError(e);
			});
	}

	async AssignGameAdmin(playerId: string, channelId: string, gameId: string): Promise<ISessionData> {
		const newChannel: ISessionData = {
			channelId: channelId,
			statInsightSet: [],
			narrationSet: [],
			multiMessageSet: [],
			globaltestSet: [],
		};
		const game = await this.games.where('id', '==', gameId).get();
		const gameData = first(game.docs)?.data() as IGame;
		const isChannelRegistered = gameData.channels.find(c => c.channelId === channelId) != null;
		if (isChannelRegistered) {
			if (gameData.adminId !== playerId) {
				throw new Error('This channel already has an admin');
			} else {
				return new Promise<ISessionData>(resolve => {
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
