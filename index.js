const Discord = require('discord.js');
const express = require('express');
const bodyParser = require('body-parser');

const FreeFormMessageMultiplePlayersHandler = require('./src/Handlers/FreeFormMultiMessageHandler')
const AmbianceHandler = require('./src/Handlers/AmbianceHandler');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const {isNil, find, findIndex} = require('lodash');

const config = require('./config/auth.json');
const parseEventMessage = require('./src/Common/parseEventMessage');
const parseCommadMessage = require('./src/Common/parseCommadMessage');
const globalHandler = require('./src/Handlers');

const client = new Discord.Client();
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
	globalHandler(channel, parsedEventMessage, message, client);
};

const processMessage = (content, channel, message) => {
	if (content.startsWith('!')) {
		const parsedEventMessage = parseEventMessage(content);
		if (!isNil(parsedEventMessage)) {
			handleEvent(parsedEventMessage, message, channel);
			return;
		}
		const activeSession = find(activeSessions, s => s.channelId === channel.channelId);
		const parsedCommandMessage = parseCommadMessage(
			content,
			activeSession
		);
		if (!isNil(parsedCommandMessage)) {
			globalHandler(channel, parsedCommandMessage, message, client);
			return;
		}
	}
};

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	const messageContent = message.content;
	const channelId = message.channel.id;
	const channel = client.channels.get(channelId);
	processMessage(messageContent, channel, message);
});

client.login(config.token);

app.post('/event', (req) => {
	const channel = client.channels.get(req.body.channel);
	processMessage(req.body.content, channel);
});

app.post('/message', (req) => {
	const { message, users, channel } = req.body;
	const handler = new FreeFormMessageMultiplePlayersHandler(message, users, channel, client);
	handler.handle();
});

app.post('/sound', (req) => {
	const { filePath, channelId, command } = req.body;
	let handler;
	// const voiceChannel = activeVoiceChannels.find(c => c.id === channelId);
	//
	// if (!isNil(voiceChannel)) {
	// 	handler = new AmbianceHandler(filePath, voiceChannel.dispatcher, command);
	// 	handler.handle();
	// } else {
	const channel = client.channels.get(channelId);
	if (channel.type === 'voice') {
		channel.join().then(
			connection => {
				activeVoiceChannels.push({ id: channelId, dispatcher: connection, currentTrack: filePath});
				handler = new AmbianceHandler(filePath, connection, command);
				handler.handle();
			}
		);
	}
});

app.listen(8080, () => {
	console.log('listening now on 8080');
});

