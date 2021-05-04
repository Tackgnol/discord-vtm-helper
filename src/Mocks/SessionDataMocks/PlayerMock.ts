import { IPlayer } from '../../Models/GameData';
import { testNPCWithFacts, testNPCWithoutFacts } from './NPCMocks';

export const playerMock: IPlayer = {
	npcSet: [testNPCWithFacts, testNPCWithoutFacts],
	discordUserName: 'test',
	statisticsSet: [{ name: 'test', value: 1 }],
	id: '0',
};
