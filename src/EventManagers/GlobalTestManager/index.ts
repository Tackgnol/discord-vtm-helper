import { isEmpty, isNaN, isNil, join, sortBy } from 'lodash';
import { reactionNumbers } from '../../Common';
import { globalTestRichEmbedInit, globalTestRichEmbedResult } from '../../Common/RichEmbeds';
import { CollectorFilter, Message, MessageReaction, TextChannel, User } from 'discord.js';
import { IVersionOption } from '../../Models/GameData';
import { InvalidInputError } from '../../Common/Errors';

export class GlobalTestManager {
	constructor(private channel: TextChannel, private message?: Message) {
		this.message = message;
		this.channel = channel;
	}

	performTest(
		testText: string,
		replyPrefix: string,
		versionOptions: IVersionOption[],
		shortCircut: boolean,
		value?: string | number
	) {
		const messageChanel = this.channel;
		let reply;
		let richEmbed;
		if (messageChanel.type === 'text') {
			if (value === 0) {
				richEmbed = globalTestRichEmbedInit(testText);
				messageChanel.send(richEmbed).then(async message => {
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
					const filter = (reaction: MessageReaction, user: User) => {
						if (user.id !== message.author.id) {
							const reactValue = reactionNumbers.indexOf(reaction.emoji.name);
							if (shortCircut) {
								reply = this.shortCircutedTest(versionOptions, +reactValue);
							} else {
								reply = this.fullTest(versionOptions, +reactValue);
							}
							richEmbed = globalTestRichEmbedResult(replyPrefix, reply);
							this.message && this.message.author.send(richEmbed);
						}
					};
					message.awaitReactions(<CollectorFilter>filter);
				});
				return;
			} else if (isNil(value)) {
				richEmbed = globalTestRichEmbedInit(testText);
				messageChanel.send(richEmbed).then(async message => {
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
					const filter = (reaction: MessageReaction, user: User) => {
						if (user.id !== message.author.id) {
							const reactValue = reactionNumbers.indexOf(reaction.emoji.name);
							if (shortCircut) {
								reply = this.shortCircutedTest(versionOptions, +reactValue);
							} else {
								reply = this.fullTest(versionOptions, +reactValue);
							}
							richEmbed = globalTestRichEmbedResult(replyPrefix, reply);
							this.message && this.message.author.send(richEmbed);
						}
					};
					message.awaitReactions(<CollectorFilter>filter);
				});
				return;
			}
			if (shortCircut) {
				reply = this.shortCircutedTest(versionOptions, +value);
			} else {
				reply = this.fullTest(versionOptions, +value);
			}
			richEmbed = globalTestRichEmbedResult(replyPrefix, reply);
			this.message && this.message.author.send(richEmbed);
		}
	}

	shortCircutedTest(versionOptions: IVersionOption[], value: number): string | null {
		if (isEmpty(versionOptions)) {
			throw new InvalidInputError('No responses available for this test');
		}

		if (isNaN(value)) {
			throw new InvalidInputError('Given value is invalid');
		}

		const sortedOptions = sortBy(versionOptions, v => -v.minResult);
		for (let i = 0; i <= sortedOptions.length; i++) {
			const currentOption = sortedOptions[i];
			if (currentOption.minResult <= value) {
				return currentOption.resultMessage;
			}
		}

		return null;
	}

	fullTest(versionOptions: IVersionOption[], value: number): string {
		if (isEmpty(versionOptions)) {
			throw new InvalidInputError('No responses available for this test');
		}

		if (isNaN(value)) {
			throw new InvalidInputError('Given value is invalid');
		}
		const sortedOptions = sortBy(versionOptions, v => v.minResult);
		const messageArray: string[] = [];
		sortedOptions.forEach(o => {
			if (o.minResult <= value) {
				messageArray.push(o.resultMessage);
			}
		});
		return join(messageArray, '\n\t');
	}
}
