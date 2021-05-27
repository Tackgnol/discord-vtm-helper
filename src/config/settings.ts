export const settings = {
	prefix: '!vtm',
	subPrefixes: {
		admin: 'a',
		globalTest: 'gt',
		messageMultiplePlayers: 'mmp',
		multiMessenger: 'mm',
		statInsight: 'si',
		narration: 'n',
		npcs: 'npcs',
		result: 'r',
		npcsSubCommands: {
			all: 'all',
		},
		adminSubCommands: {
			addPlayer: 'addPlayer',
			addNPC: 'addNPC',
			addFact: 'addFact',
			removePlayer: 'removePlayer',
			addGlobalTest: 'addGlobalTest',
			addNarration: 'addNarration',
			addStatInsight: 'addStatInsight',
			assignAdmin: 'me',
			moveAdmin: 'moveAdmin',
			new: 'new',
		},
	},
	prefixStructure: {
		vtm: 1,
		eventType: 2,
		eventName: 3,
		value: 4,
	},
	additionalCommands: {
		test: 'test',
	},
	soundCommands: {
		playTrack: 'playTrack',
		playSound: 'playSound',
		stop: 'stop',
	},
	allowWebRequests: true,
	eventSource: 'firestore',
	onlineSourceUrl: 'http://localhost:8000/graphql',
	colors: {
		richEmbeddedMain: '#8a0303',
		richEmbeddedDetails: '#590101',
	},
	lines: {
		allNPCs: 'Speak of which thou desire knowledge',
		narrationHeader: 'Silence, as I show what thy must see!',
		npcType: 'call upon',
		globalTestReply: 'Trust thine instincts, however deceitful they may be',
		globalTestHeader: 'Your skills will be put to a test',
		statInsightHeader: 'All your hard work has payed of... Use your insight',
		userMessageHeader: 'Whispers in the dark... be it friend or foe or thyself?',
		multipleChannels:
			'You have multiple channels assigned to your discord id, type in !vtm-a-current in the channel you wish to work with',
		noChannels: 'You are currently not an admin of any games !vtm-a-init in a channel to create a new game',
		newPlayer: 'Player added successfully!',
	},
	statList: [
		'Strength',
		'Dexterity',
		'Stamina',
		'Charisma',
		'Manipulation',
		'Composure',
		'Intelligence',
		'Wits',
		'Resolve',
		'Athletics',
		'Brawl',
		'Craft',
		'Drive',
		'Firearms',
		'Larceny',
		'Melee',
		'Stealth',
		'Survival',
		'AnimalKen',
		'Etiquette',
		'Insight',
		'Intimidation',
		'Leadership',
		'Performance',
		'Persuasion',
		'Streetwise',
		'Subterfuge',
		'Academics',
		'Awareness',
		'Finance',
		'Investigation',
		'Medicine',
		'Occult',
		'Politics',
		'Science',
		'Technology',
	],
};
