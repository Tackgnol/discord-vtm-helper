const Discord = require('discord.js');
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
	globalHandler(channelId, parsedEventMessage, message);
};

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	const messageContent = message.content;
	if (messageContent.startsWith('!')) {
		const channelId = message.channel.id;
		const parsedEventMessage = parseEventMessage(messageContent);
		if (!isNil(parsedEventMessage)) {
			handleEvent(parsedEventMessage, message, channelId);
			return;
		}
		const activeSession = find(activeSessions, s => s.channelId === channelId);
		const parsedCommandMessage = parseCommadMessage(
			messageContent,
			activeSession
		);
		if (!isNil(parsedCommandMessage)) {
			globalHandler(channelId, parsedCommandMessage, message);
			return;
		}
	}
});
client.login(config.token);
