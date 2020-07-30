import { isEmpty, isNil } from 'lodash';
import { Message, RichEmbed, TextChannel, User } from 'discord.js';
import { settings } from '../../config/settings';

export class FreeFormMultiMessageManager {
	constructor(private readonly channel: TextChannel) {
		this.channel = channel;
	}

	messageUsers(reply: Message, userList: User[]) {
		const messageChanel = this.channel;
		if (messageChanel.type === 'text') {
			const channelMembers = messageChanel.members;
			if (!isEmpty(userList)) {
				userList.forEach(u => {
					const foundUser = channelMembers.find(val => val.user.username === u.username);
					if (!isNil(foundUser)) {
						const richEmbed = new RichEmbed()
							.setColor(settings.colors.richEmbeddedMain)
							.setTitle(settings.lines.userMessageHeader)
							.setDescription(reply.content)
							.setColor(settings.colors.richEmbeddedMain);
						foundUser.send(richEmbed);
					}
				});
			}
		}
	}
}
