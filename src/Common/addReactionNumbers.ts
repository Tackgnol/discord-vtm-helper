import { Message } from 'discord.js';
import { reactionNumbers } from './reactionNumbers';

export const addReactionNumbers = async (message: Message) => {
	await message.react(reactionNumbers[0]);
	await message.react(reactionNumbers[1]);
	await message.react(reactionNumbers[2]);
	await message.react(reactionNumbers[3]);
	await message.react(reactionNumbers[4]);
	await message.react(reactionNumbers[5]);
	await message.react(reactionNumbers[6]);
	await message.react(reactionNumbers[7]);
	await message.react(reactionNumbers[8]);
	await message.react(reactionNumbers[9]);
};
