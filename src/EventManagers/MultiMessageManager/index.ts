import { Collection, GuildMember, MessageEmbed, User } from 'discord.js';
import { settings } from '../../config/settings';
import { isEmpty, isNil } from 'lodash';
import { IMessageList, IReply, ReplyType } from '../../Models/AppModels';

class MultiMessageManager {
	messageUsers(users: User[], channelMembers: Collection<string, GuildMember>, value: string): IReply {
		if (isEmpty(users)) {
			throw new EvalError('Channel is empty!');
		}
		const messages: IMessageList[] = [];
		if (!isEmpty(users)) {
			users.forEach(u => {
				const foundUser = channelMembers.find(val => val.user.username === u.username);
				if (!isNil(foundUser)) {
					const richEmbed = new MessageEmbed()
						.setColor(settings.colors.richEmbeddedMain)
						.setTitle(settings.lines.userMessageHeader)
						.setDescription(value)
						.setColor(settings.colors.richEmbeddedMain);
				}
				messages.push({ message: value, recipient: u });
			});
		}
		return { type: ReplyType.Multi, value: messages };
	}
}

export default MultiMessageManager;
