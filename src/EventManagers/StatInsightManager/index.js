const { isNil, isEmpty } = require('lodash');
const playerStats = require('../../Resources/playerToStat.json');

class StatInsightManager {
	constructor(message, channel) {
		this.channel = channel;
		this.message = message;
	}

	checkStat(statName, minValue, successMessage) {
		const messageChanel = this.channel;
		if (messageChanel.type === 'text') {
			const channelMembers = messageChanel.members;
			if (!isEmpty(channelMembers)) {
				channelMembers.forEach(p => {
					const thisPlayer = playerStats[p.user.username];
					if (!isNil(thisPlayer) && thisPlayer[statName] >= minValue) {
						p.send(`(${statName}:${thisPlayer[statName]}) ${successMessage}`);
					}
				});
			}
		}
		return;
	}
}

module.exports = StatInsightManager;
