const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config/auth.json');
const parseMessage = require('./src/Common/parseMessage');
const globalHandler = require('./src/Handlers');

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	const parsedMessage = parseMessage(message.content);
	if (parsedMessage) {
		globalHandler(parsedMessage, message, 'sessionDev');
	}
});
client.login(config.token);
