const _ = require('lodash');
const playerStats = require('./playerToStat.json');
class StatInsightManager {
	constructor(message) {
		this.message = message;
		this.client = message.client;
	}

	checkStat(statName, minValue) {
		const messageChanel = this.message.channel;
		if (messageChanel.type === 'text') {
			const channelMembers = messageChanel.members;
			if (!_.isEmpty(channelMembers)) {
				channelMembers.forEach(p => {
					const thisPlayer = playerStats[p.user.username];
					console.log(p.user.username);
					if (!_.isNil(thisPlayer) && thisPlayer[statName] >= minValue) {
						p.send(`you have completed the ${statName} test`);
					}
				});
			}
		}
		return;
	}
}

module.exports = StatInsightManager;
