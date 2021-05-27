import { GameQuery, Reply, ReplyChannels } from '../Models/AppModels';
import { Channel } from 'discord.js';

export function sendWrapper(
	action: Promise<Reply | void>,
	sendCallback: (reply: Reply, replyTo: ReplyChannels) => void,
	replyTo?: ReplyChannels,
	gameInfo?: GameQuery
) {
	if (replyTo?.channel === undefined && replyTo?.message === undefined) {
		throw new Error('Unable to reply no recipients available');
	}
	return action
		.then(result => {
			if (result) {
				sendCallback(result, replyTo);
			}
		})
		.catch(e => {
			replyTo?.message?.author.send(e.botMessage ?? e.message);
			replyTo?.channel?.send(e.botMessage ?? e.message);
		});
}

export const canReplyTo = (channel: Channel) => {
	return channel.type === 'text' || channel.type === 'dm';
};
