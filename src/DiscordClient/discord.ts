import {Client, Message, TextChannel} from "discord.js";
import {isAdminCommand, parseCommandMessage, parseEventMessage} from "../Common";
import {find, findIndex, isArray, isNil} from "lodash";
import {isNPCCommand} from "../Common/isNPCCommand";
import {settings} from "../config/settings";
import {getSelectedChannel} from "./utils";
import Handler from "../Handlers/handler";
import {IEvent} from "../Models/GameData";
import {IActiveSession, IGame, IReply, ReplyType} from "../Models/AppModels";
import {addReactionNumbers} from "../Common/addReactionNumbers";

export class DiscordClient {
	private handler: Handler;
	private readonly activeSessions: IActiveSession[]
	constructor(private discord: Client) {
		this.handler = new Handler();
		this.activeSessions = []
	}

	async processMessage(message:Message) {
		const messageContent = message.content;
		const channelId = message.channel.id;
		const channel = await this.discord.channels.fetch(channelId);
		const games = await global.service.GetUserChannels(message.author.id);
		let currentGame: IGame | undefined;
		if (games.length === 1) {
			currentGame = games[0];
		} else {
			currentGame = games.find(g => g.current);
		}
		if (currentGame) {
			if (channel?.type === 'dm') {
				await this.processDirectMessage(messageContent, <TextChannel>message.channel, currentGame.id, message);
				return;
			}
			this.processChannelMessage(messageContent, <TextChannel>channel, currentGame.id, message);
		}
	}

	async fetchChannel(channelId: string) {
		return await this.discord.channels.fetch(channelId);
	}

	processChannelMessage(content: string, channel: TextChannel, gameId: string, message?: Message) {
		if (content.startsWith('!')) {
			const parsedEventMessage = parseEventMessage(content);
			if (!isNil(parsedEventMessage)) {
				this.handleEvent(parsedEventMessage, channel, gameId, message);
				return;
			}
			const activeSession = find(this.activeSessions, s => s.channelId === channel.id);
			const parsedCommandMessage = parseCommandMessage(content, activeSession);
			if (!isNil(parsedCommandMessage)) {
				this.handler.handle(channel.id, parsedEventMessage, gameId, message?.author.id ?? '', channel.members);
			}
		}
	};

	private handleEvent (parsedEventMessage: Partial<IEvent>, channel: TextChannel, gameId: string, message?: Message) {
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

		this.handler
			.handle(channel.id, parsedEventMessage, gameId, message?.author.id ?? '0', channel.members)
			.then(r => {
				this.send(r, channel, message);
			})
			.catch(e => {
				console.log(e);
			});
	};


	private async processDirectMessage (content: string, channel: TextChannel, gameId: string, message: Message) {
		if (message.author.bot) {
			return;
		}
		if (content.startsWith('!')) {
			const parsedEventMessage = parseEventMessage(message.content);
			if (isAdminCommand(content) || isNPCCommand(content)) {
				const activeSession = await getSelectedChannel(message.author.id);
				if (!activeSession) {
					message.author.send(settings.lines.noChannels);
				}

				const messageChannel = await this.discord.channels.fetch(activeSession.channelId);

				if (messageChannel.isText()) {
					this.handler
						.handle(activeSession.channelId, parsedEventMessage, gameId, message.author.id, (<TextChannel>messageChannel).members)
						.then(r => {
							this.send(r, messageChannel as TextChannel, message);
						});
				}
			}
		} else {
			channel
				.send(
					'I am sorry master, you cannot speak to me directly...yet... but I am at your command, start with !vtm- then your command type and command'
				)
				.catch(() => {
					console.log('DM error, carry on nothing to se here..');
				});
		}
	};

	private send(reply: IReply, channel?: TextChannel, message?: Message) {
		switch (reply.type) {
			case ReplyType.Channel:
				channel?.send(reply.value);
				break;
			case ReplyType.Personal:
				message?.author.send(reply.value);
				break;
			case ReplyType.ReactionOneTen:
				channel?.send(reply.value).then(m => {
					addReactionNumbers(m);
				});
				break;
			case ReplyType.Multi:
				if (isArray(reply.value)) {
					reply.value.forEach(v => {
						v.recipient.send(v.message);
					});
				} else {
					throw new EvalError('Expected an Array received object');
				}
				break;
			default:
				throw new Error('Invalid message type');
		}
	};
}
