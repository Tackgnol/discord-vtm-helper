import { Player } from '../../Models/GameData';
import { testNPCWithFacts, testNPCWithoutFacts } from './NPCMocks';

export const playerMock: Player = {
	npcSet: [testNPCWithFacts, testNPCWithoutFacts],
	discordUserName: 'test',
	statisticsSet: [{ name: 'test', value: 2 }],
	id: '0',
};
