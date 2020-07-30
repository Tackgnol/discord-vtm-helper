import { Message, RichEmbed, TextChannel } from 'discord.js';
import { settings } from '../../config/settings';
import { isEmpty, isNil } from 'lodash';
import { IMultiUserMessage } from '../../Models/GameData';

class MultiMessageManager {
	constructor(private channel: TextChannel, private message?: Message) {
		this.message = message;
		this.channel = channel;
	}

	messageUsers(messageObject: IMultiUserMessage[]) {
		if (isEmpty(messageObject)) {
			return;
		}

		if (this.channel) {
			messageObject.forEach(m => {
				const channelMembers = this.channel.members;
				const userList = m.userList;
				if (!isEmpty(userList)) {
					userList.forEach(u => {
						const foundUser = channelMembers.find(val => val.user.username === u.username);
						if (!isNil(foundUser)) {
							const richEmbed = new RichEmbed()
								.setColor(settings.colors.richEmbeddedMain)
								.setTitle(settings.lines.userMessageHeader)
								.setDescription(m.value)
								.setColor(settings.colors.richEmbeddedMain);
							foundUser.send(richEmbed);
						}
					});
				}
			});
		}
	}
}

export default MultiMessageManager;
