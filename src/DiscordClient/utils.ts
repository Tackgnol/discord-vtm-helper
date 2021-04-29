import { IReply, IReplyChannels, ISessionData } from '../Models/AppModels';
import { InvalidInputError } from '../Common/Errors';
import { Channel } from 'discord.js';

export const getSelectedChannel = async (adminId: string): Promise<ISessionData> => {
	const games = await global.service.GetUserChannels(adminId);
	const currentGame = games.find(g => g.current);
	if (!currentGame) {
		throw new InvalidInputError('No active channels found');
	}
	const activeChannel = currentGame.channels.find(c => c.channelId === currentGame.activeChannel);
	if (!activeChannel) {
		throw new InvalidInputError('No active channels found');
	}
	return activeChannel;
};

export function sendWrapper(
	action: Promise<IReply | void>,
	sendCallback: (reply: IReply, replyTo: IReplyChannels) => void,
	replyTo?: IReplyChannels
) {
	if (replyTo?.channel === undefined && replyTo?.message === undefined) {
		throw new Error('Unable to reply no recepients available');
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
