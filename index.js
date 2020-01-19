const Discord = require('discord.js');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const FreeFormMessageMultiplePlayersHandler = require('./src/Handlers/FreeFormMultiMessageHandler')
const AmbianceHandler = require('./src/Handlers/AmbianceHandler');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const {isNil, find, findIndex} = require('lodash');
let config;
if (fs.existsSync('./config/auth.json')) {
	config = require('./config/auth.json');
}
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

const token = isNil(process.env.token) ? config.token : process.env.token;

client.login(token);

app.post('/event', (req, res) => {
	const channel = client.channels.get(req.body.channel);
	try {
		processMessage(req.body.content, channel);
		res.send('Success!');
	} catch (e) {
		res.send(e);
	}
});

app.post('/message', (req, res) => {
	const { message, users, channel } = req.body;
	try {
		const handler = new FreeFormMessageMultiplePlayersHandler(message, users, channel, client);
		handler.handle();
		res.send('Success!');
	} catch (e) {
		res.send(e);
	}

});

app.post('/sound', (req, res) => {
	const { filePath, channelId, command } = req.body;
	let handler;
	try {
		const channel = client.channels.get(channelId);
		if (channel.type === 'voice') {
			channel.join().then(
				connection => {
					activeVoiceChannels.push({id: channelId, dispatcher: connection, currentTrack: filePath});
					handler = new AmbianceHandler(filePath, connection, command);
					handler.handle();
					res.send('Success!');
				}
			);
		}
	} catch (e) {
		res.send(e);
	}
});

app.listen(8080, () => {
	console.log('listening now on 8080');
});

