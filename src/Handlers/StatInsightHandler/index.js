const { isNil, get, find } = require('lodash');

const StatInsightManager = require('../../EventManagers/StatInsightManager');

class StatsInsightHandler {
	constructor(session, message, query, channelId, client = null) {
		this.sessionData = session;
		this.message = message;
		this.eventName = query.eventName;
		this.value = query.value;
		const channel = !isNil(client) ? client.channels.find(c => channelId === c.id) : message.channel;
		this.manager = new StatInsightManager(message, channel);
	}

	handle() {
		const currentSession = get(this.sessionData, 'statInsights');
		const displayTest = find(currentSession, c => c.name === this.eventName);
		if (!isNil(displayTest)) {
			console.log()
			const { statName, minValue, successMessage } = displayTest;
			this.manager.checkStat(statName, minValue, successMessage);
		}
	}
}

module.exports = StatsInsightHandler;
