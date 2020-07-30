import { find, get, isNil } from 'lodash';
import NarrationManager from '../../EventManagers/NarrationManager';
import { Message, TextChannel } from 'discord.js';
import { IEvent } from '../../Models/GameData';

class NarrationHandler {
	private eventName?: string;
	private value?: string;
	private manager: NarrationManager;

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
		this.manager = new NarrationManager(channel, message);
	}

	handle() {
		const currentSession = get(this.sessionData, 'narrationeventSet');
		const narrationPiece = find(currentSession, c => c.name === this.eventName);
		if (!isNil(narrationPiece)) {
			const { narrationText, image } = narrationPiece;
			this.manager.displayNarration(narrationText, image);
		}
	}
}

export default NarrationHandler;
