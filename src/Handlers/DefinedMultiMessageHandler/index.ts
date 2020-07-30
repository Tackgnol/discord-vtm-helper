import { find, get, isNil } from 'lodash';
import MultiMessageManager from '../../EventManagers/MultiMessageManager';
import { IEvent } from '../../Models/GameData';
import { Message, TextChannel } from 'discord.js';

class MultiMessageHandler {
	private eventName?: string;
	private value?: string;
	private manager: MultiMessageManager;
	constructor(
		private sessionData: any,
		private query: Partial<IEvent>,
		private channel: TextChannel,
		private message?: Message
	) {
		this.sessionData = sessionData;
		this.message = message;
		this.eventName = query.eventName;
		this.value = query.value;
		this.manager = new MultiMessageManager(channel, message);
	}

	handle() {
		const currentSession = get(this.sessionData, 'multiMessage');
		const displayTest = find(currentSession, c => c.name === this.eventName);
		if (!isNil(displayTest)) {
			const { messageObject } = displayTest;
			this.manager.messageUsers(messageObject);
		}
	}
}

export default MultiMessageHandler;
