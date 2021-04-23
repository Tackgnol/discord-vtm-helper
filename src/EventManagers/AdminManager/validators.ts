const imageRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg))/i;

const validateAddPlayer = (input: RegExpExecArray) => {
	const errorArray = [];
	if (!(typeof input[1] === 'string')) {
		errorArray.push('DiscordClient name not specified');
	}
	if (!(typeof input[2] === 'string')) {
		errorArray.push('DiscordId not specified');
	}
	if (!input[3]) {
		errorArray.push('Statistics array / object not filled');
	} else if (input[3].charAt(0) === '{' && input[3].slice(-1) !== '}') {
		errorArray.push('Invalid stat object format, please open and close the {}');
	} else if (input[3].charAt(0) === '{' && input[3].slice(-1) === '}' && !/{(\w+:\d, ?)+(\w+:\d){1}}/g.test(input[3])) {
		errorArray.push('Invalid stat format expected {stat:value,stat:value,stat:value}');
	} else if (input[3].charAt(0) !== '{' && !/(\d,)+(\d){1}/.test(input[3])) {
		errorArray.push('Invalid stat format expected value,value,value');
	}
	return errorArray;
};

const validateAddNPC = (input: RegExpExecArray) => {
	const errorArray = [];
	if (!(typeof input[1] === 'string')) {
		errorArray.push('NPC name not specified');
	}
	if (!(typeof input[2] === 'string')) {
		errorArray.push('NPC call name not specified');
	}
	if (!(typeof input[3] === 'string')) {
		errorArray.push('NPC image not specified');
	} else if (!imageRegex.test(input[3])) {
		errorArray.push('NPC image url invalid, accepted formats: jpg, jpeg and png');
	}
	if (!input[4]) {
		errorArray.push('NPC description not specified');
	}
	return errorArray;
};

const validateAddFacts = (input: RegExpExecArray) => {
	const errorArray = [];
	const IdSeparateChecker = /^([0-9]+,?\s*)+$/g;
	const factSeparateChecker = /^([a-zA-Z0-9]+,?\s*)+$/g;
	if (!(typeof input[1] === 'string')) {
		errorArray.push('npc name not specified');
	}
	if (!IdSeparateChecker.exec(input[2])) {
		errorArray.push('Invalid playerIds insert playerId seperated by commas ex. [1241512, 1512521,123123]');
	}
	if (!factSeparateChecker.exec(input[3])) {
		errorArray.push('Invalid facts insert facts separated by commas ex. [Fact 1, Fact 2,Fact3]');
	}
	return errorArray;
};

const validateAddNarration = (input: RegExpExecArray) => {
	const errorArray = [];
	if (!(typeof input[1] === 'string')) {
		errorArray.push('Event name must a text');
	} else if (/^\w+%/i.exec(input[1])) {
		errorArray.push('Only letters are allowed in the event name, no spaces, no special characters');
	}
	if (!(typeof input[2] === 'string')) {
		errorArray.push('Event image must a text');
	} else if (!imageRegex.test(input[2])) {
		errorArray.push('NPC image url invalid, accepted formats: jpg, jpeg and png');
	}
	if (!(typeof input[3] === 'string')) {
		errorArray.push('Event description must a text');
	}
	return errorArray;
};

const validateAddStatInsight = (input: RegExpExecArray) => {
	const errorArray = [];
	if (!(typeof input[1] === 'string')) {
		errorArray.push('Event name must a text');
	} else if (/^\w+%/i.exec(input[1])) {
		errorArray.push('Only letters are allowed in the event name, no spaces, no special characters');
	}
	if (!(typeof input[2] === 'string')) {
		errorArray.push('stat name must a text');
	} else if (/^\w+%/i.exec(input[2])) {
		errorArray.push(
			'Only letters are allowed in the stat name, no spaces, no special characters, if a stat has a space please use CamelCase'
		);
	}
	if (isNaN(+input[3])) {
		errorArray.push('Stat value needs to be a number');
	}
	if (!(typeof input[4] === 'string')) {
		errorArray.push('Success message needs to be string');
	}
	return errorArray;
};

const isObject = (input: string) => {
	return input.charAt(0) === '{' && input.slice(-1) === '}';
};

export { isObject, validateAddFacts, validateAddNPC, validateAddPlayer, validateAddNarration, validateAddStatInsight };
