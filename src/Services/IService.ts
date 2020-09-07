import { IGlobalTest, INarration, INPC, IPlayer, IStat, IStatInsight, IVersionOption } from '../Models/GameData';
import { IGame, ISessionData } from '../Models/AppModels';

export interface IService {
	GetPlayer: (playerId: string, gameId: string) => Promise<IPlayer>;
	GetEvents: (channelId: string, gameId: string) => Promise<ISessionData>;
	GetUserChannels: (userId: string) => Promise<IGame[]>;
	AddPlayer: (name: string, id: string, statArray: IStat[], gameId: string) => Promise<IPlayer>;
	AddNPC: (name: string, callName: string, image: string, description: string, gameId: string) => Promise<Omit<INPC, 'facts'>>;
	AddFactsToNPC: (playerId: string, npc: string, facts: string[], gameId: string) => Promise<INPC>;
	AddNarration: (name: string, image: string, narrationText: string, channelId: string, gameId: string) => Promise<INarration>;
	AddStatInsight: (
		name: string,
		stat: string,
		value: number,
		message: string,
		channelId: string,
		gameId: string
	) => Promise<IStatInsight>;
	AddGlobalTest: (
		name: string,
		message: string,
		shortCircuit: boolean,
		replyPrefix: string,
		globaltestoptionSet: IVersionOption[],
		channelId: string,
		gameId: string
	) => Promise<IGlobalTest>;
	AssignGameAdmin: (playerId: string, channelId: string, gameId: string) => Promise<ISessionData>;
}
