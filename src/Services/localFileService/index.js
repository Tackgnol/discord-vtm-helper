const { isNil, find, get } = require('lodash');
const allPlayerData = require('../../../Resources/players');
const channelToSession = require('../../../Resources/channelToSession.json');
const sessionData = require('../../../Resources/events/');

class LocalFileService {
	GetPlayer(playerId) {
		const playerData = find(allPlayerData, p => p.id === playerId);
		if (!isNil(playerData)) {
			return playerData.npcSet;
		}
	}

	GetEvents(channelId) {
		const sessionName = this.getChannelSession(channelId);
		return sessionData[sessionName];
	}

	getChannelSession(channelId) {
		return get(
			find(channelToSession, c => c.id === channelId),
			'session'
		);
	}
}

module.exports = LocalFileService;
