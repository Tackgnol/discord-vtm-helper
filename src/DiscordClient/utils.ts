import {ISessionData} from "../Models/AppModels";

export const getSelectedChannel = async (adminId: string): Promise<ISessionData> => {
	const games = await global.service.GetUserChannels(adminId);
	const currentGame = games.find(g => g.current);
	if (!currentGame) {
		throw EvalError('No suitable games found');
	}
	const activeChannel = currentGame.channels.find(c => c.channelId === currentGame.activeChannel);
	if (!activeChannel) {
		throw EvalError('No active channels found');
	}
	return activeChannel;
};
