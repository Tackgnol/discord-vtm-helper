import { IEvent, GlobalTest, IMultiPlayerMessage, Narration, Player, StatInsight } from './GameData';
import { DMChannel, Message, MessageAttachment, MessageEmbed, PartialUser, TextChannel, User } from 'discord.js';

export interface IActiveSession {
	channelId: string;
	gameId: string;
	prevCommand: Partial<IEvent>;
}

export interface ISelectedChannel {
	id: string;
	adminId: string;
	activeChannel: string;
}

export interface IVoiceChannel {
	id: string;
}

export interface SessionData {
	channelId: string;
	globaltestSet?: GlobalTest[];
	narrationSet?: Narration[];
	statInsightSet?: StatInsight[];
	multiMessageSet?: IMultiPlayerMessage[];
}

export interface Game {
	id: string;
	adminId: string;
	players: Player[];
	channels: SessionData[];
	current?: boolean;
	activeChannel: string;
}

export interface IMessageList {
	recipient: string;
	message: MessageEmbed | string;
}

export interface IReply {
	test?: string;
	type: ReplyType;
	value: MessageEmbed | IMessageList[] | MessageAttachment | string;
}

export enum ReplyType {
	Personal,
	Channel,
	Multi,
	ReactionOneTen,
	NoReply,
}

export interface IReplyChannels {
	message?: Message;
	channel?: TextChannel | DMChannel | null;
	user?: User | PartialUser;
	gameId: string;
}

export interface PlayerFacts {
	facts: string[];
	player: string;
}
