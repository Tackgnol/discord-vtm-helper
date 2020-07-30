import { GlobalTestManager } from '../../EventManagers';
import { find, isNil } from 'lodash';
import { Message, TextChannel } from 'discord.js';
import { IEvent } from '../../Models/GameData';
import { ISessionData } from '../../Models/AppModels';

class GlobalTestHandler {
	private eventName?: string;
	private value?: string;
	private manager: GlobalTestManager;

	constructor(
		private sessionData: ISessionData,
		private query: Partial<IEvent>,
		private channel: TextChannel,
		private message?: Message
	) {
		this.sessionData = sessionData;
		this.message = message;
		this.eventName = query.eventName;
		this.value = query.value;
		this.manager = new GlobalTestManager(channel, message);
	}

	handle() {
		const currentSession = this.sessionData.globaltestSet;
		const displayTest = find(currentSession, c => c.name === this.eventName);
		if (!isNil(displayTest)) {
			const { testMessage, replyPrefix, shortCircuit, globaltestoptionSet } = displayTest;
			this.manager.performTest(testMessage, replyPrefix, globaltestoptionSet, shortCircuit, this.value);
		}
	}
}

export default GlobalTestHandler;
