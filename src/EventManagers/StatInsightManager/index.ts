import { find, isEmpty, isNil } from 'lodash';
import { statInsightRichEmbed } from '../../Common/RichEmbeds';
import { Message, TextChannel } from 'discord.js';

class StatInsightManager {
	constructor(private channel: TextChannel) {
		this.channel = channel;
	}

	async checkStat(statName: string, minValue: number, successMessage: string) {
		const channelMembers = this.channel.members;
		if (!isEmpty(channelMembers)) {
			for (const [snowflake, member] of channelMembers) {
				const thisPlayer = await global.service.GetPlayer(snowflake);
				const statValue = thisPlayer && find(thisPlayer.statisticsSet, s => s.name === statName);
				if (!isNil(statValue) && statValue.value >= minValue) {
					member.send(statInsightRichEmbed(statName, minValue, successMessage));
				}
			}
		}
	}
}

export default StatInsightManager;