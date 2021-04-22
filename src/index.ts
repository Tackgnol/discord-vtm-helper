import Discord, { Message, TextChannel } from 'discord.js';
import express from 'express';
import bodyParser from 'body-parser';
import { FreeFormMessageMultiplePlayersHandler } from './Handlers';
import { find, findIndex, isNil, isArray } from 'lodash';
import { settings } from './config/settings';
import { Auth } from './config/auth';
import initializeService from './Services';
import { isAdminCommand, parseCommandMessage, parseEventMessage } from './Common';
import Handler from './Handlers/handler';
import { IActiveSession, IGame, IReply, ISessionData, IVoiceChannel, ReplyType } from './Models/AppModels';
import { IEvent } from './Models/GameData';
import { IService } from './Services/IService';
import { addReactionNumbers } from './Common/addReactionNumbers';
import { isNPCCommand } from './Common/isNPCCommand';

declare global {
	namespace NodeJS {
		interface Global {
			service: IService;
		}
	}
}

const app = express();
const handler = new Handler();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
const discordClient = new Discord.Client();
const activeSessions: IActiveSession[] = [];

const getSelectedChannel = async (adminId: string): Promise<ISessionData> => {
	const games = await global.service.GetUserChannels(adminId);
	const currentGame = games.find(g => g.current);
	if (!currentGame) {
		throw EvalError('No suitable games found');
	}
	const activeChannel = currentGame.channels.find(c => c.channelId === currentGame.activeChannel);
	if (!activeChannel) {
		throw EvalError('No active channels found');
	}
	return activeChannel;
};

const send = (reply: IReply, channel?: TextChannel, message?: Message) => {
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

const handleEvent = (parsedEventMessage: Partial<IEvent>, channel: TextChannel, gameId: string, message?: Message) => {
	const sessionIndex = findIndex(activeSessions, (s: IActiveSession) => s.channelId === channel.id);
	if (sessionIndex === -1) {
		activeSessions.push({
			channelId: channel.id,
			prevCommand: parsedEventMessage,
			gameId: gameId,
		});
	} else {
		activeSessions[sessionIndex] = {
			channelId: channel.id,
			prevCommand: parsedEventMessage,
			gameId: gameId,
		};
	}

	handler
		.handle(channel.id, parsedEventMessage, gameId, message?.author.id ?? '0', channel.members)
		.then(r => {
			send(r, channel, message);
		})
		.catch(e => {
			console.log(e);
		});
};

const processChannelMessage = (content: string, channel: TextChannel, gameId: string, message?: Message) => {
	if (content.startsWith('!')) {
		const parsedEventMessage = parseEventMessage(content);
		if (!isNil(parsedEventMessage)) {
			handleEvent(parsedEventMessage, channel, gameId, message);
			return;
		}
		const activeSession = find(activeSessions, s => s.channelId === channel.id);
		const parsedCommandMessage = parseCommandMessage(content, activeSession);
		if (!isNil(parsedCommandMessage)) {
			handler.handle(channel.id, parsedEventMessage, gameId, message?.author.id ?? '', channel.members);
		}
	}
};

const processDirectMessage = async (content: string, channel: TextChannel, gameId: string, message: Message) => {
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

			const messageChannel = await discordClient.channels.fetch(activeSession.channelId);

			if (messageChannel.isText()) {
				handler
					.handle(activeSession.channelId, parsedEventMessage, gameId, message.author.id, (<TextChannel>messageChannel).members)
					.then(r => {
						send(r, messageChannel as TextChannel, message);
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

const serviceType = settings.eventSource;
global.service = initializeService(serviceType);

discordClient.once('ready', () => {
	console.log('Ready!');
});

discordClient.on('message', async message => {
	const messageContent = message.content;
	const channelId = message.channel.id;
	const channel = await discordClient.channels.fetch(channelId);
	const games = await global.service.GetUserChannels(message.author.id);
	let currentGame: IGame | undefined;
	if (games.length === 1) {
		currentGame = games[0];
	} else {
		currentGame = games.find(g => g.current);
	}
	if (currentGame) {
		if (channel?.type === 'dm') {
			await processDirectMessage(messageContent, <TextChannel>message.channel, currentGame.id, message);
			return;
		}
		processChannelMessage(messageContent, <TextChannel>channel, currentGame.id, message);
	}
});

const token = isNil(process.env.token) ? Auth.token : process.env.token;

if (!token) {
	console.error('You need to specify a token in config/auth.ts');
} else {
	discordClient.login(token);
}

if (settings.eventSource === 'online') {
	app.post('/event', async (req, res) => {
		const channel = await discordClient.channels.fetch(req.body.channel);
		const gameId = req.body.gameId;

		try {
			processChannelMessage(req.body.content, <TextChannel>channel, gameId);
			res.send('Success!');
		} catch (e) {
			res.send(e);
		}
	});

	app.post('/message', async (req, res) => {
		const { message, users, channelId } = req.body;
		const channel = await discordClient.channels.fetch(channelId);
		try {
			const handler = new FreeFormMessageMultiplePlayersHandler(users, <TextChannel>channel, message);
			handler.handle();
			res.send('Success!');
		} catch (e) {
			res.send(e);
		}
	});
	// TODO: This was not working and was not converted to TS yet
	// app.post('/sound', async (req, res) => {
	// 	const { filePath, channelId, command } = req.body;
	// 	let manager;
	// 	try {
	// 		let voiceChannel = find(activeVoiceChannels, vc => vc.id === channelId);
	// 		if (isNil(get(voiceChannel, 'connection'))) {
	// 			const channel = discordClient.channels.get(channelId);
	// 			if (channel.type === 'voice') {
	// 				const connection = await channel.join();
	// 				manager = new SoundManager(filePath, connection);
	// 				voiceChannel = { id: channelId, connection: connection, channel: channel, currentTrack: filePath, manager: manager };
	// 				activeVoiceChannels.push(voiceChannel);
	// 			}
	// 		}
	// 		switch (command) {
	// 			case settings.soundCommands.playTrack:
	// 				voiceChannel.manager.playAmbiance(filePath);
	// 				break;
	// 			case settings.soundCommands.playSound:
	// 				voiceChannel.manager.playSound(filePath);
	// 				break;
	// 			case settings.soundCommands.stop:
	// 				manager = voiceChannel.manager;
	// 				activeVoiceChannels.splice(
	// 					findIndex(activeVoiceChannels, vc => vc.id === channelId),
	// 					1
	// 				);
	// 				manager.stop();
	// 				break;
	// 			default:
	// 				voiceChannel.manager.stop();
	// 				activeVoiceChannels.splice(
	// 					findIndex(activeVoiceChannels, vc => vc.id === channelId),
	// 					1
	// 				);
	// 		}
	// 		res.send('Success!');
	// 	} catch (e) {
	// 		res.send(e);
	// 	}
	// });
	app.listen(8080, () => {
		console.log('listening now on 8080');
	});
}
