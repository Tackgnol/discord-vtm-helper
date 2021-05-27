import { isEmpty, isNil, intersection } from 'lodash';
import { MessageEmbed } from 'discord.js';
import { settings } from '../../config/settings';
import { MessageList, Reply, ReplyType } from '../../Models/AppModels';
import { InvalidInputError } from '../../Common/Errors';

export class FreeFormMultiMessageManager {
	messageUsers(reply: string, userList: string[], channelMembers: string[]): Reply {
		const users = intersection(userList, channelMembers);
		if (isEmpty(users)) {
			throw new InvalidInputError('No users to send to');
		}
		const messageLists: MessageList[] = [];
		users.forEach(u => {
			const foundUser = channelMembers.find(val => val === u);
			if (!isNil(foundUser)) {
				const richEmbed = new MessageEmbed()
					.setColor(settings.colors.richEmbeddedMain)
					.setTitle(settings.lines.userMessageHeader)
					.setDescription(reply)
					.setColor(settings.colors.richEmbeddedMain);
				messageLists.push({ message: richEmbed, recipient: u });
			}
		});
		return {
			type: ReplyType.Multi,
			value: messageLists,
		};
	}
}
