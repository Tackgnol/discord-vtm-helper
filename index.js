const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config/auth.json');
const StatInsightManager = require('./src/EventManagers/StatInsightManager');
const GlobalTestManager = require('./src/EventManagers/GlobalTestManager');
client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	const statInsightHandler = new StatInsightManager(message);
	if (message.content === '!Politics' && !message.author.bot) {
		statInsightHandler.checkStat('Politics', 4);
	}

	if (message.content === '!Occult' && !message.author.bot) {
		statInsightHandler.checkStat('Occult', 2);
	}

	if (message.content.startsWith('!investigation') && !message.author.bot) {
		const args = message.content.slice('!investigation'.length).split(' ');
		const value = +args[1];
		const optionArray = [
			{ minResult: 0, resultMessage: 'Chyba trup...' },
			{ minResult: 1, resultMessage: 'Wygląda na samobójstwo' },
			{
				minResult: 2,
				resultMessage: 'Odciski na szyji świadczą o powieszeniu'
			},
			{
				minResult: 3,
				resultMessage: 'Zaraz... Zaraz, ma krew pod paznokciami'
			},
			{ minResult: 4, resultMessage: 'Podbrzusze mocno obite' },
			{
				minResult: 5,
				resultMessage: 'Rozbryzgi krwi ewidentnie z 2 różnych osób'
			}
		];
		const testManager = new GlobalTestManager(message);
		const testMessage =
			'Test Investigation, rzucamy Wits + Investigation lub Intligence + Medicine następnie odpowiadamy w tej rozmowie przez "!investigation wynik"';
		const replyPrefix = 'Pochylasz się nad zwłokami...';
		testManager.performTest(testMessage, replyPrefix, optionArray, true, value);
	}
});
client.login(config.token);
