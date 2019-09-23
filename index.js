const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config/auth.json');
const StatInsightManager = require('./src/EventManagers/StatInsightManager');
client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	const statInsightHandler = new StatInsightManager(message);
	statInsightHandler.checkStat('Occult', 5);
	console.log(message.content);
});

client.login(config.token);
