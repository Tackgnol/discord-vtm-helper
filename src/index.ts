import Discord, { Channel, Message, TextChannel } from 'discord.js';
import express from 'express';
import bodyParser from 'body-parser';
import { FreeFormMessageMultiplePlayersHandler } from './Handlers';
import { find, findIndex, isNil } from 'lodash';
import { settings } from './config/settings';
import { Auth } from './config/auth';
import initializeService from './Services';
import { isAdminCommand, parseCommandMessage, parseEventMessage } from './Common';
import globalHandler from './Handlers/handler';
import { IActiveSession, ISelectedChannel, IVoiceChannel } from './Models/AppModels';
import { IEvent } from './Models/GameData';
import { IService } from './Services/IService';

declare global {
	namespace NodeJS {
		interface Global {
			service: IService;
		}
	}
}

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
const discordClient = new Discord.Client();
const activeSessions: IActiveSession[] = [];
const activeVoiceChannels: IVoiceChannel[] = [];
const selectedChannels: ISelectedChannel[] = [];

const getSelectedChannel = (adminId: string) => {
	return find(selectedChannels, (c: ISelectedChannel) => c.adminId === adminId);
};

const handleEvent = (parsedEventMessage: Partial<IEvent>, channel: TextChannel, message?: Message) => {
	const sessionIndex = findIndex(activeSessions, (s: IActiveSession) => s.channelId === channel.id);
	if (sessionIndex === -1) {
		activeSessions.push({
			channelId: channel.id,
			prevCommand: parsedEventMessage,
		});
	} else {
		activeSessions[sessionIndex] = {
			channelId: channel.id,
			prevCommand: parsedEventMessage,
		};
	}

	globalHandler(channel, parsedEventMessage, message);
};

const processChannelMessage = (content: string, channel: TextChannel, message?: Message) => {
	if (content.startsWith('!')) {
		const parsedEventMessage = parseEventMessage(content);
		if (!isNil(parsedEventMessage)) {
			handleEvent(parsedEventMessage, channel, message);
			return;
		}
		const activeSession = find(activeSessions, s => s.channelId === channel.id);
		const parsedCommandMessage = parseCommandMessage(content, activeSession);
		if (!isNil(parsedCommandMessage)) {
			globalHandler(channel, parsedCommandMessage, message);
		}
	}
};

const processDirectMessage = async (content: string, channel: TextChannel, message: Message) => {
	let messageChannel: Channel;
	const selectedChannel = getSelectedChannel(message.author.id);
	if (message.author.bot) {
		return;
	}
	if (content.startsWith('!')) {
		const parsedEventMessage = parseEventMessage(message.content);
		if (isAdminCommand(content) && selectedChannel) {
			const games = await global.service.GetUserChannels(message.author.id);
			if (games.length === 0) {
				message.author.send(settings.lines.noChannels);
			} else if (games.length > 1) {
				messageChannel = discordClient.channels.find(c => c.id === (selectedChannel.id ?? '') && c.type === 'text');
				if (messageChannel) {
					globalHandler(<TextChannel>messageChannel, parsedEventMessage, message);
				} else {
					message.author.send(settings.lines.multipleChannels);
				}
			} else {
				const myGame = games[0];
				if (myGame) {
					if (myGame.channels.length > 1) {
						messageChannel = discordClient.channels.find(c => c.id === (selectedChannel.id ?? '') && c.type === 'text');
						if (messageChannel) {
							globalHandler(<TextChannel>messageChannel, parsedEventMessage, message);
						} else {
							message.author.send(settings.lines.multipleChannels);
						}
					} else {
						messageChannel = discordClient.channels.find(
							c => c.id === (getSelectedChannel(message.author.id)?.id ?? '') && c.type === 'text'
						);
						globalHandler(<TextChannel>messageChannel, parsedEventMessage, message);
					}
				}
			}
		} else {
			globalHandler(channel, parsedEventMessage, message);
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
	const channel = discordClient.channels.get(channelId);
	if (channel?.type === 'dm') {
		await processDirectMessage(messageContent, <TextChannel>message.channel, message);
		return;
	}
	processChannelMessage(messageContent, <TextChannel>channel, message);
});

const token = isNil(process.env.token) ? Auth.token : process.env.token;

if (!token) {
	console.error('You need to specify a token in config/auth.ts');
} else {
	discordClient.login(token);
}

if (settings.eventSource === 'online') {
	app.post('/event', (req, res) => {
		const channel = discordClient.channels.get(req.body.channel);

		try {
			processChannelMessage(req.body.content, <TextChannel>channel);
			res.send('Success!');
		} catch (e) {
			res.send(e);
		}
	});

	app.post('/message', (req, res) => {
		const { message, users, channelId } = req.body;
		const channel = discordClient.channels.get(channelId);
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
