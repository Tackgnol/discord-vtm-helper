const Discord = require('discord.js');
const express = require('express');
const bodyParser = require('body-parser');
const FreeFormMessageMultiplePlayersHandler = require('./src/Handlers/FreeFormMultiMessageHandler')

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const { isNil, find, findIndex } = require('lodash');

const config = require('./config/auth.json');
const parseEventMessage = require('./src/Common/parseEventMessage');
const parseCommadMessage = require('./src/Common/parseCommadMessage');
const globalHandler = require('./src/Handlers');

const client = new Discord.Client();
const activeSessions = [];

const handleEvent = (parsedEventMessage, message, channelId) => {
	const sessionIndex = findIndex(
		activeSessions,
		s => s.channelId === channelId
	);
	if (sessionIndex === -1) {
		activeSessions.push({
			channelId: channelId,
			prevCommand: parsedEventMessage,
		});
	} else {
		activeSessions[sessionIndex] = {
			channelId: channelId,
			prevCommand: parsedEventMessage,
		};
	}
	globalHandler(channelId, parsedEventMessage, message, client);
};

const processMessage = (content, channelId, message) => {
	if (content.startsWith('!')) {
		const parsedEventMessage = parseEventMessage(content);
		if (!isNil(parsedEventMessage)) {
			handleEvent(parsedEventMessage, message, channelId);
			return;
		}
		const activeSession = find(activeSessions, s => s.channelId === channelId);
		const parsedCommandMessage = parseCommadMessage(
			content,
			activeSession
		);
		if (!isNil(parsedCommandMessage)) {
			globalHandler(channelId, parsedCommandMessage, message, client);
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
	processMessage(messageContent, channelId, message);
});

client.login(config.token);

app.post('/event', (req) => {
	processMessage(req.body.content, req.body.channel);
});

app.post('/message', (req) => {
	const { message, users, channel } = req.body;
	const handler = new FreeFormMessageMultiplePlayersHandler(message, users, channel, client);
	handler.handle();
});

app.listen(8080, () => {
	console.log('listening now');
});
