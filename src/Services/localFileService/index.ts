import { join } from 'path';
import { uniq } from 'lodash';
import { Game, SessionData } from '../../Models/AppModels';
import { IService } from '../IService';
import { GlobalTest, MessageTest, Narration, NPC, Option, Player, Stat, StatInsight } from '../../Models/GameData';
import { Low, JSONFile } from 'lowdb';
import { v4 } from 'uuid';

class LocalFileService implements IService {
	private games: Low<Game[]>;
	private npcs: Low<NPC[]>;
	private tests: Low<MessageTest[]>;
	constructor() {
		const gamesFile = join(__dirname, 'local/games.json');
		const npcsFile = join(__dirname, 'local/npcs.json');
		const testMessageFile = join(__dirname, 'local/testMessage.json');
		const gameAdapter = new JSONFile<Game[]>(gamesFile);
		const npcAdapter = new JSONFile<NPC[]>(npcsFile);
		const testMessageAdapter = new JSONFile<MessageTest[]>(testMessageFile);
		this.games = new Low<Game[]>(gameAdapter);
		this.npcs = new Low<NPC[]>(npcAdapter);
		this.tests = new Low<MessageTest[]>(testMessageAdapter);
	}

	async AddFactsToNPC(playerId: string, npc: string, facts: string[], gameId: string): Promise<NPC> {
		await this.games.read();
		const player = this.findGamePlayer(playerId, this.findGameById(gameId));
		const playerNpc = player.npcSet.find(n => n.callName === npc);
		if (!playerNpc) {
			throw new Error('NPC not found');
		}
		playerNpc.facts = uniq([...playerNpc.facts, ...facts]);
		await this.games.write();
		return playerNpc;
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
		const test: GlobalTest = {
			name,
			testMessage: message,
			shortCircuit,
			replyPrefix,
			globaltestoptionSet,
		};
		await this.games.read();
		const channel = this.findGameChannel(channelId, this.findGameById(gameId));
		if (channel.globaltestSet) {
			channel.globaltestSet?.push(test);
		} else {
			channel.globaltestSet = [test];
		}
		await this.games.write();
		return test;
	}

	async AddNPC(
		name: string,
		callName: string,
		image: string,
		description: string,
		gameId: string
	): Promise<Omit<NPC, 'facts'>> {
		await this.npcs.read();
		const npc: NPC = {
			name,
			callName,
			image,
			description,
			gameId,
			facts: [],
		};
		this.npcs.data?.push(npc);
		await this.npcs.write();
		return npc;
	}

	async AddNarration(
		name: string,
		image: string,
		narrationText: string,
		channelId: string,
		gameId: string
	): Promise<Narration> {
		await this.games.read();
		const channel = this.findGameChannel(channelId, this.findGameById(gameId));
		const narration: Narration = {
			name,
			image,
			narrationText,
		};
		if (channel.narrationSet) {
			channel.narrationSet?.push(narration);
		} else {
			channel.narrationSet = [narration];
		}
		await this.games.write();
		return narration;
	}

	async AddPlayer(name: string, id: string, statArray: Stat[], gameId: string): Promise<Player> {
		await this.games.read();
		const game = this.findGameById(gameId);
		const player: Player = {
			discordUserName: name,
			id,
			npcSet: [],
			statisticsSet: statArray,
		};
		if (game.players) {
			game.players.push(player);
		} else {
			game.players = [player];
		}
		await this.games.write();
		return player;
	}

	async AddStatInsight(
		name: string,
		stat: string,
		value: number,
		message: string,
		channelId: string,
		gameId: string
	): Promise<StatInsight> {
		await this.games.read();
		const insight: StatInsight = {
			name,
			statName: stat,
			minValue: value,
			successMessage: message,
		};
		const channel = this.findGameChannel(channelId, this.findGameById(gameId));
		if (channel.statInsightSet) {
			channel.statInsightSet.push(insight);
		} else {
			channel.statInsightSet = [insight];
		}
		await this.games.write();
		return insight;
	}

	async AssignActiveMessage(messageId: string, testCall: string, gameId: string): Promise<string> {
		await this.tests.read();
		const test: MessageTest = { messageId, gameId, testCall };
		if (this.tests.data) {
			this.tests.data.push(test);
		} else {
			this.tests.data = [test];
		}
		await this.tests.write();
		return 'Saved a new message test';
	}

	async AssignGameAdmin(playerId: string, channelId: string, gameId: string): Promise<SessionData> {
		await this.games.read();
		const game = this.findGameById(gameId);
		game.adminId = playerId;
		await this.games.write();
		return this.findGameChannel(channelId, game);
	}

	async GetEvents(channelId: string, gameId: string): Promise<SessionData> {
		await this.games.read();
		return this.findGameChannel(channelId, this.findGameById(gameId));
	}

	async GetPlayer(playerId: string, gameId: string): Promise<Player | undefined> {
		await this.games.read();
		return this.findGamePlayer(playerId, this.findGameById(gameId));
	}

	async GetTestByMessageId(messageId: string): Promise<MessageTest> {
		await this.tests.read();

		return this.findTestMessage(messageId);
	}

	async GetUserChannels(userId: string): Promise<Game[]> {
		await this.games.read();
		return this.findGamesByAdmin(userId);
	}

	async NewGame(admin: string, channelId: string): Promise<Game> {
		await this.games.read();
		const channel: SessionData = {
			channelId,
			statInsightSet: [],
			narrationSet: [],
			globaltestSet: [],
			multiMessageSet: [],
		};
		const game: Game = {
			id: v4(),
			adminId: admin,
			channels: [channel],
			activeChannel: channelId,
			current: true,
			players: [],
		};
		if (this.games.data) {
			this.games.data.push(game);
		} else {
			this.games.data = [game];
		}
		return game;
	}

	async RemovePlayer(playerId: string, gameId: string): Promise<string> {
		await this.games.read();
		const game = this.findGameById(gameId);
		const playerIndex = game.players.findIndex(p => p.id === playerId);
		if (playerIndex === -1) {
			throw new Error(`Player of discord id ${playerId} does not exist in the game`);
		}
		game.players.splice(playerIndex, 1);
		await this.games.write();
		return Promise.resolve(`Player: ${game.players[playerIndex].discordUserName} has been removed from the game`);
	}

	private findGameById(gameId: string): Game {
		const game = this.games.data?.find(g => g.id === gameId);
		if (!game) {
			throw new Error('Game not found');
		}
		return game;
	}

	private findGamesByAdmin(adminId: string): Game[] {
		const game = this.games.data?.filter(g => g.adminId === adminId);
		if (!game) {
			throw new Error('No games for this admin id');
		}
		return game;
	}

	private findGameChannel(channelId: string, game: Game) {
		const channel = game.channels.find(c => c.channelId === channelId);
		if (!channel) {
			throw new Error('Channel not found!');
		}
		return channel;
	}

	private findGamePlayer(playerId: string, game: Game) {
		const player = game.players.find(p => p.id === playerId);
		if (!player) {
			throw new Error('Player not found');
		}
		return player;
	}

	private findTestMessage(messageId: string) {
		const testMessage = this.tests.data?.find(t => t.messageId === messageId);
		if (!testMessage) {
			throw new Error('This message does not have a test');
		}
		return testMessage;
	}
}

export default LocalFileService;
