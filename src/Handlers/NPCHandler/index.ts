import NPCManager from '../../EventManagers/NPCManager';
import { settings } from '../../config/settings';
import { Message } from 'discord.js';
import { IEvent } from '../../Models/GameData';

class NPCHandler {
	private eventName?: string;
	private value?: string;
	private manager: NPCManager;

	constructor(private sessionData: any, private query: Partial<IEvent>, private message?: Message) {
		this.sessionData = sessionData;
		this.eventName = query.eventName;
		this.value = query.value;
		this.manager = new NPCManager(message);
	}

	handle() {
		if (this.eventName === settings.subPrefixes.npcsSubCommands.all) {
			this.manager.allNPCs(this.sessionData);
		} else {
			this.eventName && this.manager.oneNPC(this.sessionData, this.eventName);
		}
	}
}

export default NPCHandler;
