export interface IEvent {
	eventName: string;
	prefix: string;
	type: string;
	value: string;
}

export interface INPC {
	name: string;
	description: string;
	image: string;
	facts: string[];
	callName: string;
}

export interface IStat {
	name: string;
	value: string | number;
}

export interface IVersionOption {
	minResult: number;
	resultMessage: string;
}

export interface IMultiUserMessage {
	userList: string[];
	value: string;
}

export interface IFactSet {
	npc: INPC;
	facts: string[];
}

export interface INarration {
	name: string;
	narrationText: string;
	image?: string;
}

export interface IGlobalTest {
	name: string;
	testMessage: string;
	shortCircuit: boolean;
	replyPrefix: string;
	globaltestoptionSet: IVersionOption[];
}

export interface IStatInsight {
	name: string;
	statName: string;
	minValue: number;
	successMessage: string;
}

export interface IMultiPlayerMessage {
	name: string;
	userList: string[];
	message: string;
}

export interface IPlayer {
	id: string;
	discordUserName: string;
	npcSet: IFactSet[];
	statisticsSet: IStat[];
}

export interface IPlayerNPCKnowledge {
	npc: INPC;
	facts: string[];
}
