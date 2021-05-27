import { Client, Message, TextChannel } from 'discord.js';
import { isAdminCommand, parseEventMessage } from '../Common';
import { findIndex, isArray, isNil } from 'lodash';
import { isNPCCommand } from '../Common/isNPCCommand';
import { settings } from '../config/settings';
import { canReplyTo, sendWrapper } from './utils';
import Handler from '../Handlers/handler';
import { Event } from '../Models/GameData';
import { ActiveSession, Game, Reply, ReplyChannels, SessionData, ReplyType } from '../Models/AppModels';
import { addReactionNumbers } from '../Common/addReactionNumbers';
import { InvalidInputError } from '../Common/Errors/InvalidInputError';
import { IService } from '../Services/IService';

export class DiscordClient {
	private handler: Handler;
	private readonly activeSessions: ActiveSession[];
	constructor(private discord: Client, private service: IService) {
		this.handler = new Handler(service);
		this.activeSessions = [];
	}

	async processMessage(message: Message) {
		const channelId = message.channel.id;
		const channel = await this.discord.channels.fetch(channelId);
		const games = await this.service.GetUserChannels(message.author.id);
		const parsedEventMessage = parseEventMessage(message.content);
		let currentGame: Game | undefined;
		if (games.length === 1) {
			currentGame = games[0];
		} else {
			currentGame = games.find(g => g.current);
		}
		if (currentGame && canReplyTo(channel)) {
			if (channel?.type === 'dm') {
				sendWrapper(this.processDirectMessage(parsedEventMessage, currentGame.id, message), this.send, {
					message,
				});
			} else {
				sendWrapper(this.processChannelMessage(parsedEventMessage, <TextChannel>channel, currentGame.id, message), this.send, {
					message,
				});
			}
		}
	}

	async fetchChannel(channelId: string) {
		return await this.discord.channels.fetch(channelId);
	}

	send(reply: Reply, replyTo: ReplyChannels) {
		switch (reply.type) {
			case ReplyType.Channel:
				replyTo.channel?.send(reply.value);
				break;
			case ReplyType.Personal:
				replyTo.message?.author.send(reply.value);
				break;
			case ReplyType.ReactionOneTen:
				replyTo.channel?.send(reply.value).then(m => {
					addReactionNumbers(m).then(() => {
						reply.value;
					});
				});
				break;
			case ReplyType.Multi:
				if (isArray(reply.value)) {
					reply.value.forEach(v => {
						const user = replyTo.channel?.members.get(v.recipient);
						user && user.send(v.message);
					});
				} else {
					throw new InvalidInputError('Invalid test definition!');
				}
				break;
			case ReplyType.NoReply:
				return;
			default:
				throw new InvalidInputError('Invalid message type');
		}
	}

	processChannelMessage(event: Partial<Event>, channel: TextChannel, gameId: string, message?: Message) {
		if (event.prefix === settings.prefix) {
			if (!isNil(event)) {
				return sendWrapper(this.handleEvent(event, channel, gameId, message), this.send, { channel });
			}
			throw new InvalidInputError('Invalid bot command');
		}
		throw new InvalidInputError('All bot commands must start with "!"');
	}

	private handleEvent(parsedEventMessage: Partial<Event>, channel: TextChannel, gameId: string, message?: Message) {
		const sessionIndex = findIndex(this.activeSessions, (s: ActiveSession) => s.channelId === channel.id);
		if (sessionIndex === -1) {
			this.activeSessions.push({
				channelId: channel.id,
				prevCommand: parsedEventMessage,
				gameId: gameId,
			});
		} else {
			this.activeSessions[sessionIndex] = {
				channelId: channel.id,
				prevCommand: parsedEventMessage,
				gameId: gameId,
			};
		}

		return sendWrapper(
			this.handler.handle(channel.id, parsedEventMessage, gameId, message?.author.id ?? '0', channel.members),
			this.send,
			{ channel, message }
		);
	}

	private async processDirectMessage(event: Partial<Event>, gameId: string, message: Message) {
		if (message.author.bot) {
			return new Promise<Reply>(resolve => {
				resolve({ value: '', type: ReplyType.NoReply });
			});
		}
		if (event.prefix === settings.prefix) {
			if (isAdminCommand(event.type) || isNPCCommand(event.type)) {
				const activeSession = await this.getSelectedChannel(message.author.id);
				if (!activeSession) {
					throw new InvalidInputError(settings.lines.noChannels);
				}

				const messageChannel = await this.discord.channels.fetch(activeSession.channelId);

				if (messageChannel.isText()) {
					return sendWrapper(
						this.handler.handle(
							activeSession.channelId,
							event,
							gameId,
							message.author.id,
							(<TextChannel>messageChannel).members
						),
						this.send,
						{ message, channel: <TextChannel>messageChannel }
					);
				}
				throw new InvalidInputError('Cannot reply to this channel!');
			}
			throw new InvalidInputError('Unknown command!');
		} else {
			throw new InvalidInputError('All bot messages must begin with a "!"');
		}
	}

	private getSelectedChannel = async (adminId: string): Promise<SessionData> => {
		const games = await this.service.GetUserChannels(adminId);
		const currentGame = games.find(g => g.current);
		if (!currentGame) {
			throw new InvalidInputError('No active channels found');
		}
		const activeChannel = currentGame.channels.find(c => c.channelId === currentGame.activeChannel);
		if (!activeChannel) {
			throw new InvalidInputError('No active channels found');
		}
		return activeChannel;
	};
}
