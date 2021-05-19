import { IGame } from '../Models/AppModels';
import { activeSessionMock } from './SessionDataMocks/ActiveSessionMock';
import { playerMock } from './SessionDataMocks/PlayerMock';

export const gameMock: IGame = {
	activeChannel: activeSessionMock.channelId,
	adminId: '0',
	channels: [activeSessionMock],
	current: true,
	id: 'x',
	players: [playerMock],
};
