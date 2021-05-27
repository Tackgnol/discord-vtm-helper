import { Event, GlobalTest, MultiPlayerMessage, Narration, Player, StatInsight } from './GameData';
import { Message, MessageAttachment, MessageEmbed, TextChannel } from 'discord.js';

export interface ActiveSession {
	channelId: string;
	gameId: string;
	prevCommand: Partial<Event>;
}

export interface SelectedChannel {
	id: string;
	adminId: string;
	activeChannel: string;
}

export interface VoiceChannel {
	id: string;
}

export interface SessionData {
	channelId: string;
	globaltestSet?: GlobalTest[];
	narrationSet?: Narration[];
	statInsightSet?: StatInsight[];
	multiMessageSet?: MultiPlayerMessage[];
}

export interface Game {
	id: string;
	adminId: string;
	players: Player[];
	channels: SessionData[];
	current?: boolean;
	activeChannel: string;
}

export interface MessageList {
	recipient: string;
	message: MessageEmbed | string;
}

export interface Reply {
	type: ReplyType;
	value: MessageEmbed | MessageList[] | MessageAttachment | string;
}

export enum ReplyType {
	Personal,
	Channel,
	Multi,
	ReactionOneTen,
	NoReply,
}

export interface ReplyChannels {
	message?: Message;
	channel?: TextChannel;
}

export interface GameQuery {
	gameId: string;
	channelId: string;
	eventType: string;
	eventName: string;
}
