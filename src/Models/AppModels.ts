import { IEvent, IGlobalTest, IMultiPlayerMessage, INarration, IPlayer, IStatInsight } from './GameData';
import { Message, MessageAttachment, MessageEmbed, TextChannel } from 'discord.js';

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
	current?: boolean;
	activeChannel: string;
}

export interface IMessageList {
	recipient: string;
	message: MessageEmbed | string;
}

export interface IReply {
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
	channel?: TextChannel;
}
