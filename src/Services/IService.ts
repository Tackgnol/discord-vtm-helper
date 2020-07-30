import { IGlobalTest, INarration, INPC, IPlayer, IStat, IStatInsight, IVersionOption } from '../Models/GameData';
import { IGame, ISessionData } from '../Models/AppModels';

export interface IService {
	GetPlayer: (playerId: string) => Promise<IPlayer>;
	GetEvents: (channelId: string) => Promise<ISessionData>;
	GetUserChannels: (userId: string) => Promise<IGame[]>;
	AddPlayer: (name: string, id: string, statArray: IStat[]) => Promise<IPlayer>;
	AddNPC: (name: string, callName: string, image: string, description: string) => Promise<Omit<INPC, 'facts'>>;
	AddFactsToNPC: (playerId: string, npc: string, facts: string[]) => Promise<INPC>;
	AddNarration: (name: string, image: string, narrationText: string) => Promise<INarration>;
	AddStatInsight: (name: string, stat: string, value: number, message: string) => Promise<IStatInsight>;
	AddGlobalTest: (
		name: string,
		message: string,
		shortCircuit: boolean,
		replyPrefix: string,
		globaltestoptionSet: IVersionOption[]
	) => Promise<IGlobalTest>;
	AssignGameAdmin: (playerId: string, channelId: string, gameId: string) => Promise<ISessionData>;
}
