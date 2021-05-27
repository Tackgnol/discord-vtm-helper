import { MessageEmbed } from 'discord.js';
import { settings } from '../../config/settings';
import { isEmpty, isNil } from 'lodash';
import { MessageList, Reply, ReplyType } from '../../Models/AppModels';
import { InvalidInputError } from '../../Common/Errors/InvalidInputError';

class MultiMessageManager {
	messageUsers(users: string[], channelMembers: string[], value: string): Reply {
		if (isEmpty(users)) {
			throw new InvalidInputError('This channel has no users!');
		}
		const messages: MessageList[] = [];
		if (!isEmpty(users)) {
			users.forEach(u => {
				const foundUser = channelMembers.find(val => val === u);
				if (!isNil(foundUser)) {
					const richEmbed = new MessageEmbed()
						.setColor(settings.colors.richEmbeddedMain)
						.setTitle(settings.lines.userMessageHeader)
						.setDescription(value)
						.setColor(settings.colors.richEmbeddedMain);
					messages.push({ message: richEmbed, recipient: u });
				}
			});
			return { type: ReplyType.Multi, value: messages };
		}
		throw new InvalidInputError('Channel has no users');
	}
}

export default MultiMessageManager;
