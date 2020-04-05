const { isNil, get, find } = require('lodash');
const StatInsightManager = require('../../EventManagers/StatInsightManager');

class StatsInsightHandler {
	constructor(session, message, query, channel) {
		this.sessionData = session;
		this.message = message;
		this.eventName = query.eventName;
		this.value = query.value;
		this.manager = new StatInsightManager(message, channel);
	}

	handle() {
		const currentSession = get(this.sessionData, 'statinsightSet');
		const displayTest = find(currentSession, c => c.name === this.eventName);
		if (!isNil(displayTest)) {
			const { statName, minValue, successMessage } = displayTest;
			this.manager.checkStat(statName, minValue, successMessage);
		}
	}
}

module.exports = StatsInsightHandler;
