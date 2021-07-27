import { Channel } from 'discord.js';

export const canReplyTo = (channel: Channel) => {
	return channel.type === 'text' || channel.type === 'dm';
};
