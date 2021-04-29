import { find, isEmpty, isNil } from 'lodash';
import { statInsightRichEmbed } from '../../Common';
import { Collection, GuildMember } from 'discord.js';
import { IMessageList, ReplyType } from '../../Models/AppModels';
import { InvalidInputError } from '../../Common/Errors/InvalidInputError';

class StatInsightManager {
	async checkStat(
		statName: string,
		minValue: number,
		successMessage: string,
		gameId: string,
		channelMembers: Collection<string, GuildMember>
	) {
		const messageList: IMessageList[] = [];
		if (!isEmpty(channelMembers)) {
			for (const [snowflake, member] of channelMembers) {
				const thisPlayer = await global.service.GetPlayer(snowflake, gameId);
				const statValue = thisPlayer && find(thisPlayer.statisticsSet, s => s.name === statName);
				if (!isNil(statValue) && statValue.value >= minValue) {
					messageList.push({ recipient: member, message: statInsightRichEmbed(statName, minValue, successMessage) });
				}
			}
			return { type: ReplyType.Multi, value: messageList };
		} else {
			throw new InvalidInputError('Channel has no members!');
		}
	}
}

export default StatInsightManager;
