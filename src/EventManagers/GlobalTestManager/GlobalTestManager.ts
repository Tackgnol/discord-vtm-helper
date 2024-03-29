import { isEmpty, isNaN, isNil, join, sortBy } from 'lodash';
import { globalTestRichEmbedInit, reactionNumbers } from '../../Common';
import { globalTestRichEmbedResult } from '../../Common';
import { Message, MessageOptions, MessageEmbed, StringResolvable } from 'discord.js';
import { Option } from '../../Models/GameData';
import { InvalidInputError } from '../../Common/Errors';
import { IReply, ReplyType } from '../../Models/AppModels';
import { IService } from '../../Services/IService';
import { settings } from '../../config/settings';

export class GlobalTestManager {
	constructor() {}
	async initTest(testName: string, testText: string) {
		return {
			test: `${settings.prefix}-${settings.subPrefixes.globalTest}-${testName}`,
			type: ReplyType.ReactionOneTen,
			value: globalTestRichEmbedInit(testText),
		};
	}
	performTest(
		testText: string,
		replyPrefix: string,
		versionOptions: Option[],
		shortCircuit: boolean,
		value?: string | number
	): IReply {
		let reply;

		if (isEmpty(versionOptions)) {
			throw new InvalidInputError('No responses available for this test');
		}

		if (isNil(value) || isNaN(+value)) {
			throw new InvalidInputError('Given value is invalid');
		}
		if (shortCircuit) {
			reply = this.shortCircuitedTest(versionOptions, +value);
		} else {
			reply = this.fullTest(versionOptions, +value);
		}
		return { type: ReplyType.Personal, value: globalTestRichEmbedResult(replyPrefix, reply) };
	}

	shortCircuitedTest(versionOptions: Option[], value: number): string | null {
		const sortedOptions = sortBy(versionOptions, v => -v.minResult);
		for (let i = 0; i <= sortedOptions.length; i++) {
			const currentOption = sortedOptions[i];
			if (currentOption.minResult <= value) {
				return currentOption.resultMessage;
			}
		}

		return null;
	}

	fullTest(versionOptions: Option[], value: number): string {
		const sortedOptions = sortBy(versionOptions, v => v.minResult);
		const messageArray: string[] = [];
		sortedOptions.forEach(o => {
			if (o.minResult <= value) {
				messageArray.push(o.resultMessage);
			}
		});
		if (messageArray.length === 0) {
			return 'You can\'t seem to figure it out...';
		}
		return join(messageArray, '\n\t');
	}

	handleReaction = (
		shortCircuit: boolean,
		message: Message,
		replyPrefix: string,
		versionOptions: Option[],
		sendfn: (content?: StringResolvable, options?: (MessageOptions & { split: false }) | MessageEmbed) => Promise<Message>
	) => {
		const filter = (reaction: { emoji: { name: string } }, user: { id: string }) => {
			return reactionNumbers.includes(reaction.emoji.name) && user.id === message.author.id;
		};

		message.awaitReactions(filter).then(collected => {
			const reaction = collected.first();
			const value = reactionNumbers.indexOf(reaction?.emoji.name ?? '');
			let reply: string | null;
			if (shortCircuit) {
				reply = this.shortCircuitedTest(versionOptions, +value);
			} else {
				reply = this.fullTest(versionOptions, +value);
			}
			sendfn(globalTestRichEmbedResult(replyPrefix, reply));
		});
	};
}
