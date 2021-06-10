import { GlobalTest, Narration, NPC, Player, Stat, StatInsight, Option } from '../Models/GameData';
import { Game, SessionData } from '../Models/AppModels';

export interface IService {
	GetPlayer: (playerId: string, gameId: string) => Promise<Player | undefined>;
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
		globaltestoptionSet: Option[],
		channelId: string,
		gameId: string
	) => Promise<GlobalTest>;
	AssignGameAdmin: (playerId: string, channelId: string, gameId: string) => Promise<SessionData>;
}
