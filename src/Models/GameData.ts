export interface Event {
	eventName: string;
	prefix: string;
	type: string;
	value: string;
}

export interface NPC {
	name: string;
	description: string;
	image: string;
	facts: string[];
	callName: string;
}

export interface Stat {
	name: string;
	value: string | number;
}

export interface VersionOption {
	minResult: number;
	resultMessage: string;
}

export interface MultiUserMessage {
	userList: string[];
	value: string;
}

export interface Narration {
	name: string;
	narrationText: string;
	image?: string;
}

export interface GlobalTest {
	name: string;
	testMessage: string;
	shortCircuit: boolean;
	replyPrefix: string;
	globaltestoptionSet: VersionOption[];
}

export interface StatInsight {
	name: string;
	statName: string;
	minValue: number;
	successMessage: string;
}

export interface MultiPlayerMessage {
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

export interface PlayerNPCKnowledge {
	npc: NPC;
	facts: string[];
}
