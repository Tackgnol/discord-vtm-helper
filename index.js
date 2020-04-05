const Discord = require('discord.js');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const FreeFormMessageMultiplePlayersHandler = require('./src/Handlers/FreeFormMultiMessageHandler');
const SoundManager = require('./src/EventManagers/SoundManager');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());


const { get, isNil, find, findIndex } = require('lodash');
let config;
if (fs.existsSync('./config/auth.json')) {
	config = require('./config/auth.json');
}
const settings = require('./config/settings.json');
const parseEventMessage = require('./src/Common/parseEventMessage');
const parseCommadMessage = require('./src/Common/parseCommadMessage');
const globalHandler = require('./src/Handlers');

const discordClient = new Discord.Client();
const activeSessions = [];
const activeVoiceChannels = [];

const handleEvent = (parsedEventMessage, message, channel) => {
	const sessionIndex = findIndex(
		activeSessions,
		s => s.channelId === channel.id
	);
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

const processChannelMessage = (content, channel, message) => {
	if (content.startsWith('!')) {
		const parsedEventMessage = parseEventMessage(content);
		if (!isNil(parsedEventMessage)) {
			handleEvent(parsedEventMessage, message, channel);
			return;
		}
		const activeSession = find(activeSessions, s => s.channelId === channel.id);
		const parsedCommandMessage = parseCommadMessage(
			content,
			activeSession
		);
		if (!isNil(parsedCommandMessage)) {
			globalHandler(channel, parsedCommandMessage, message);
			return;
		}
	}
};

const processDirectMessage = (content, channel, message) => {
	if (content.startsWith('!')) {
		const parsedEventMessage = parseEventMessage(message);
		globalHandler(channel, parsedEventMessage, message);
	} else {
		channel.send('I am sorry master, you cannot speak to me directly...yet... but I am at your command, start with !vtm- then your command type and command').catch(() => {
			console.log('DM error, carry on nothing to se here..');
		});
	}

};

discordClient.once('ready', () => {
	console.log('Ready!');
});

discordClient.on('message', message => {
	const messageContent = message.content;
	const channelId = message.channel.id;
	const channel = discordClient.channels.get(channelId);
	if (channel.type === 'dm') {
		processDirectMessage(messageContent, message.author, message);
		return;
	}
	processChannelMessage(messageContent, channel, message);
});

const token = isNil(process.env.token) ? config.token : process.env.token;

if (!token) {
	console.error('You need to specify a token in config/auth.json');
} else {
	discordClient.login(token);
}

if (settings.eventSource === 'online') {
	app.post('/event', (req, res) => {
		const channel = discordClient.channels.get(req.body.channel);

		try {
			processChannelMessage(req.body.content, channel);
			res.send('Success!');
		} catch (e) {
			res.send(e);
		}
	});

	app.post('/message', (req, res) => {
		const { message, users, channelId } = req.body;
		const channel = discordClient.channels.get(channelId);
		try {
			const handler = new FreeFormMessageMultiplePlayersHandler(message, users, channel);
			handler.handle();
			res.send('Success!');
		} catch (e) {
			res.send(e);
		}

	});

	app.post('/sound', async (req, res) => {
		const { filePath, channelId, command } = req.body;
		let manager;
		try {
			let voiceChannel = find(activeVoiceChannels, vc => vc.id === channelId);
			if (isNil(get(voiceChannel, 'connection'))) {
				const channel = discordClient.channels.get(channelId);
				if (channel.type === 'voice') {
					const connection = await channel.join();
					manager = new SoundManager(filePath, connection);
					voiceChannel = { id: channelId, connection: connection, channel: channel, currentTrack: filePath, manager: manager };
					activeVoiceChannels.push(voiceChannel);
				}
			}
			switch (command) {
			case settings.soundCommands.playTrack:
				voiceChannel.manager.playAmbiance(filePath);
				break;
			case settings.soundCommands.playSound:
				voiceChannel.manager.playSound(filePath);
				break;
			case settings.soundCommands.stop:
				manager = voiceChannel.manager;
				activeVoiceChannels.splice(findIndex(activeVoiceChannels, vc => vc.id === channelId), 1);
				manager.stop();
				break;
			default:
				voiceChannel.manager.stop();
				activeVoiceChannels.splice(findIndex(activeVoiceChannels, vc => vc.id === channelId), 1);
			}
			res.send('Success!');
		} catch (e) {
			res.send(e);
		}
	})
	;
	app.listen(8080, () => {
		console.log('listening now on 8080');
	});

}
