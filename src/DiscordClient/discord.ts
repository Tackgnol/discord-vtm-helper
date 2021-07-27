import { Client, Message, MessageReaction, PartialUser, TextChannel, User } from 'discord.js';
import { isAdminCommand, parseCommandMessage, parseEventMessage } from '../Common';
import { find, findIndex, isArray, isNil } from 'lodash';
import { isNPCCommand } from '../Common/isNPCCommand';
import { settings } from '../config/settings';
import { canReplyTo } from './utils';
import Handler from '../Handlers/handler';
import { IEvent } from '../Models/GameData';
import { Game, IActiveSession, IReply, IReplyChannels, ReplyType, SessionData } from '../Models/AppModels';
import { addReactionNumbers } from '../Common/addReactionNumbers';
import { InvalidInputError } from '../Common/Errors/InvalidInputError';
import { IService } from '../Services/IService';

export class DiscordClient {
	private handler: Handler;
	private readonly activeSessions: IActiveSession[];
	constructor(private discord: Client, private service: IService) {
		this.handler = new Handler(service);
		this.activeSessions = [];
	}

	async processMessage(message: Message) {
		const messageContent = message.content;
		const channelId = message.channel.id;
		const channel = await this.discord.channels.fetch(channelId);
		const games = await this.service.GetUserChannels(message.author.id);
		let currentGame: Game | undefined;
		if (games.length === 1) {
			currentGame = games[0];
		} else {
			currentGame = games.find(g => g.current);
		}
		if (currentGame && canReplyTo(channel)) {
			if (channel?.type === 'dm') {
				this.sendWrapper(this.processDirectMessage(messageContent, currentGame.id, message), {
					message,
					gameId: currentGame.id,
				});
			} else {
				this.sendWrapper(this.processChannelMessage(messageContent, <TextChannel>channel, currentGame.id, message), {
					message,
					gameId: currentGame.id,
				});
			}
		}
	}

	async processReaction(reaction: MessageReaction, user: User | PartialUser) {
		if (!reaction.me) {
			const { message, emoji } = reaction;
			const reactionValue = emoji.identifier[0];
			const channelId = message.channel.id;

			const { testCall, gameId } = await this.service.GetTestByMessageId(message.id);
			const content = `${testCall} ${reactionValue}`;
			this.processMessageReaction(content, channelId, gameId, user);
		}
	}

	async fetchChannel(channelId: string) {
		return await this.discord.channels.fetch(channelId);
	}

	send(reply: IReply, replyTo: IReplyChannels) {
		switch (reply.type) {
			case ReplyType.Channel:
				replyTo.channel?.send(reply.value);
				break;
			case ReplyType.Personal:
				replyTo.user?.send(reply.value);
				replyTo.message?.author.send(reply.value);
				replyTo.channel?.send(reply.value);
				break;
			case ReplyType.ReactionOneTen:
				replyTo.channel?.send(reply.value).then(m => {
					addReactionNumbers(m);
					if (reply.test) {
						this.service.AssignActiveMessage(m.id, reply.test, replyTo.gameId);
					}
				});
				break;
			case ReplyType.Multi:
				if (isArray(reply.value)) {
					reply.value.forEach(v => {
						if (replyTo?.channel instanceof TextChannel) {
							const user = replyTo.channel?.members.get(v.recipient);
							user && user.send(v.message);
						}
					});
				} else {
					throw new InvalidInputError('Invalid test definition!');
				}
				break;
			default:
				throw new InvalidInputError('Invalid message type');
		}
	}

	processMessageReaction(content: string, channelId: string, gameId: string, user: User | PartialUser) {
		if (content.startsWith('!')) {
			const parsedEventMessage = parseEventMessage(content);
			return this.sendWrapper(this.handler.handle(channelId, parsedEventMessage, gameId), { user, gameId });
		}
		throw new InvalidInputError('All bot commands must start with "!"');
	}

	processChannelMessage(content: string, channel: TextChannel, gameId: string, message?: Message) {
		if (content.startsWith('!')) {
			const parsedEventMessage = parseEventMessage(content);
			if (!isNil(parsedEventMessage)) {
				return this.sendWrapper(this.handleEvent(parsedEventMessage, channel, gameId, message), { channel, gameId });
			}
			const activeSession = find(this.activeSessions, s => s.channelId === channel.id);
			const parsedCommandMessage = parseCommandMessage(content, activeSession);
			if (!isNil(parsedCommandMessage)) {
				return this.sendWrapper(
					this.handler.handle(channel.id, parsedEventMessage, gameId, message?.author.id ?? '', channel.members),

					{ channel, gameId }
				);
			}
			throw new InvalidInputError('Invalid bot command');
		}
		throw new InvalidInputError('All bot commands must start with "!"');
	}

	private handleEvent(parsedEventMessage: Partial<IEvent>, channel: TextChannel, gameId: string, message?: Message) {
		const sessionIndex = findIndex(this.activeSessions, (s: IActiveSession) => s.channelId === channel.id);
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

		return this.sendWrapper(
			this.handler.handle(channel.id, parsedEventMessage, gameId, message?.author.id ?? '', channel.members),

			{ channel, message, gameId }
		);
	}

	private async processDirectMessage(content: string, gameId: string, message: Message) {
		if (message.author.bot) {
			return new Promise<IReply>(resolve => {
				resolve({ test: content, value: '', type: ReplyType.NoReply });
			});
		}
		if (content.startsWith('!')) {
			const parsedEventMessage = parseEventMessage(message.content);
			if (isAdminCommand(content) || isNPCCommand(content)) {
				const activeSession = await this.getSelectedChannel(message.author.id);
				if (!activeSession) {
					throw new InvalidInputError(settings.lines.noChannels);
				}

				const messageChannel = await this.discord.channels.fetch(activeSession.channelId);

				if (messageChannel.isText()) {
					return this.sendWrapper(
						this.handler.handle(
							activeSession.channelId,
							parsedEventMessage,
							gameId,
							message.author.id,
							(<TextChannel>messageChannel).members
						),
						{ message, channel: <TextChannel>messageChannel, gameId }
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

	private sendWrapper(action: Promise<IReply | void>, replyTo?: IReplyChannels) {
		if (replyTo?.channel === undefined && replyTo?.message === undefined && replyTo?.user === undefined) {
			throw new Error('Unable to reply no recepients available');
		}
		return action
			.then(result => {
				if (result) {
					this.send(result, replyTo);
				}
			})
			.catch(e => {
				if (replyTo.message) {
					replyTo?.message?.author.send(e.botMessage ?? e.message);
				} else {
					replyTo?.channel?.send(e.botMessage ?? e.message);
				}
			});
	}
}
