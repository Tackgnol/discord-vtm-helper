import { GlobalTest, Narration, NPC, Player, Stat, StatInsight, VersionOption } from '../Models/GameData';
import { Game, GameQuery, SessionData } from '../Models/AppModels';

export interface IService {
	GetPlayer: (playerId: string, gameId: string) => Promise<Player>;
	GetEvents: (channelId: string, gameId: string) => Promise<SessionData>;
	GetUserChannels: (userId: string) => Promise<Game[]>;
	AddPlayer: (name: string, id: string, statArray: Stat[], gameId: string) => Promise<Player>;
	AddNPC: (name: string, callName: string, image: string, description: string, gameId: string) => Promise<Omit<NPC, 'facts'>>;
	AddFactsToNPC: (playerId: string, npc: string, facts: string[], gameId: string) => Promise<NPC>;
	AddNarration: (name: string, image: string, narrationText: string, channelId: string, gameId: string) => Promise<Narration>;
	AddStatInsight: (
		name: string,
		stat: string,
		value: number,
		message: string,
		channelId: string,
		gameId: string
	) => Promise<StatInsight>;
	AddGlobalTest: (
		name: string,
		message: string,
		shortCircuit: boolean,
		replyPrefix: string,
		globaltestoptionSet: VersionOption[],
		channelId: string,
		gameId: string
	) => Promise<GlobalTest>;
	AssignGameAdmin: (playerId: string, channelId: string, gameId: string) => Promise<SessionData>;
	AssignEventToMessage: (messageId: string, gameInfo: GameQuery) => Promise<void>;
}
