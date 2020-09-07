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
		private gameId: string,
		private message?: Message
	) {
		this.sessionData = sessionData;
		this.message = message;
		this.eventName = query.eventName;
		this.value = query.value;
		this.manager = new AdminManager(channel, message);
		this.gameId = gameId;
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
				this.manager.addPlayer(this.value, this.channel.id);
				break;
			case addNPC:
				this.manager.addNPC(this.value, this.gameId);
				break;
			case addFact:
				this.manager.addFactsToNPCs(this.value, this.gameId);
				break;
			case removePlayer:
				throw Error('Unimplemented');
			case addGlobalTest:
				this.manager.addGlobalTest(this.value, this.channel.id, this.gameId);
				break;
			case addStatInsight:
				this.manager.addStatInsight(this.value, this.channel.id, this.gameId);
				break;
			case addNarration:
				this.manager.addNarrationEvent(this.value, this.channel.id, this.gameId);
				break;
			case assignAdmin:
				this.manager.assignAdminToChannel();
			default:
				console.log(this.eventName);
		}
	}
}

export default AdminHandler;
