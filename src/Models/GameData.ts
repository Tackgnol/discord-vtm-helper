export interface IEvent {
	eventName: string;
	prefix: string;
	type: string;
	value: string;
}

export interface NPC {
	gameId: string;
	name: string;
	description: string;
	image: string;
	facts: string[];
	callName: string;
}

export interface Stat {
	name: string;
	value: number;
}

export interface Option {
	minResult: number;
	resultMessage: string;
}

export interface BaseTest {
	name: string;
}

export interface Narration extends BaseTest {
	narrationText: string;
	image?: string;
}

export interface GlobalTest extends BaseTest {
	testMessage: string;
	shortCircuit: boolean;
	replyPrefix: string;
	globaltestoptionSet: Option[];
}

export interface StatInsight extends BaseTest {
	statName: string;
	minValue: number;
	successMessage: string;
}

export interface IMultiPlayerMessage {
	name: string;
	userList: string[];
	message: string;
}

export interface Player {
	id: string;
	discordUserName: string;
	npcSet: NPC[];
	statisticsSet: Stat[];
}

export interface MessageTest {
	messageId: string;
	testCall: string;
	gameId: string;
}
