import { IEvent, IGlobalTest, IMultiPlayerMessage, INarration, IPlayer, IStatInsight } from './GameData';

export interface IActiveSession {
	channelId: string;
	prevCommand: Partial<IEvent>;
}

export interface ISelectedChannel {
	id: string;
	adminId: string;
}

export interface IVoiceChannel {
	id: string;
}

export interface ISessionData {
	channelId: string;
	globaltestSet?: IGlobalTest[];
	narrationSet?: INarration[];
	statInsightSet?: IStatInsight[];
	multiMessageSet?: IMultiPlayerMessage[];
}

export interface IGame {
	id: string;
	adminId: string;
	players: IPlayer[];
	channels: ISessionData[];
}
