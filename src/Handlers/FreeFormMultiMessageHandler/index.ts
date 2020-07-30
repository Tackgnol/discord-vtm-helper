import { isArray, isNil } from 'lodash';
import { Message, TextChannel, User } from 'discord.js';
import { FreeFormMultiMessageManager } from '../../EventManagers/FreeFormMultiMessageManager';

export class FreeFormMessageMultiplePlayersHandler {
	private manager: FreeFormMultiMessageManager;

	constructor(private userList: User[], private channel: TextChannel, private message?: Message) {
		this.message = message;
		this.userList = isArray(userList) ? userList : [userList];
		this.manager = new FreeFormMultiMessageManager(channel);
	}

	handle() {
		if (!isNil(this.message)) {
			this.manager.messageUsers(this.message, this.userList);
		}
	}
}
