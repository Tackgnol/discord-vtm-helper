import { settings } from '../../config/settings';
import { AdminManager } from '../../EventManagers/AdminManager';
import { Message, TextChannel } from 'discord.js';
import { IEvent } from '../../Models/GameData';

class AdminHandler {
	private eventName?: string;
	private value?: string;
	private manager: AdminManager;

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
		this.manager = new AdminManager(channel, message);
	}

	handle() {
		const {
			addPlayer,
			addNPC,
			addFact,
			removePlayer,
			addGlobalTest,
			addStatInsight,
			addNarration,
			assignAdmin,
		} = settings.subPrefixes.adminSubCommands;
		switch (this.eventName) {
			case addPlayer:
				this.manager.addPlayer(this.value);
				break;
			case addNPC:
				this.manager.addNPC(this.value);
				break;
			case addFact:
				this.manager.addFactsToNPCs(this.value);
				break;
			case removePlayer:
				throw Error('Unimplemented');
			case addGlobalTest:
				this.manager.addGlobalTest(this.value);
				break;
			case addStatInsight:
				this.manager.addStatInsight(this.value);
				break;
			case addNarration:
				this.manager.addNarrationEvent(this.value);
				break;
			case assignAdmin:
				this.manager.assignAdminToChannel();
			default:
				console.log(this.eventName);
		}
	}
}

export default AdminHandler;
