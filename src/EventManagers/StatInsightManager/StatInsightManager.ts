import { find, isEmpty, isNil } from 'lodash';
import { statInsightRichEmbed } from '../../Common';
import { MessageList, ReplyType } from '../../Models/AppModels';
import { InvalidInputError } from '../../Common/Errors/InvalidInputError';
import { IService } from '../../Services/IService';

class StatInsightManager {
	constructor(private service: IService) {}
	async checkStat(statName: string, minValue: number, successMessage: string, gameId: string, channelMembers: string[]) {
		const messageList: MessageList[] = [];
		if (!isEmpty(channelMembers)) {
			for (const member of channelMembers) {
				const thisPlayer = await this.service.GetPlayer(member, gameId);
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
