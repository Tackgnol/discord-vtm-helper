import { find, get, isNil } from 'lodash';
import StatInsightManager from '../../EventManagers/StatInsightManager';
import { Message, TextChannel } from 'discord.js';
import { IEvent } from '../../Models/GameData';

class StatsInsightHandler {
	private eventName?: string;
	private value?: string;
	private manager: StatInsightManager;

	constructor(
		private sessionData: any,
		private query: Partial<IEvent>,
		private channel: TextChannel,
		private message?: Message
	) {
		this.sessionData = sessionData;
		this.message = message;
		this.eventName = query.eventName;
		this.value = query.value;
		this.manager = new StatInsightManager(channel);
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

export default StatsInsightHandler;
