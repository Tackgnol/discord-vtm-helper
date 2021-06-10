import NPCManager from './NPCManager';
import { playerMock } from '../../Mocks/SessionDataMocks/PlayerMock';
import { allNPCs, existingNPC, nonExistentNPC } from '../../Mocks/QueryMocks/npcQuery';
import { expect } from 'chai';
import { InvalidInputError } from '../../Common/Errors/InvalidInputError';

describe('EventManagers >> NPCManager >> NPCManager', () => {
	const manager = new NPCManager();

	it('displays all npcs for the game', () => {
		const result = manager.displayNPCInfo(allNPCs.eventName ?? 'all', playerMock.npcSet);
		expect(result).toMatchSnapshot();
	});

	it('displays a requested npc if one exists', () => {
		const result = manager.displayNPCInfo(existingNPC.eventName ?? 'all', playerMock.npcSet);
		expect(result).toMatchSnapshot();
	});

	it('throws an error when requesting a non-existent npc', () => {
		expect(() => {
			manager.displayNPCInfo(nonExistentNPC.eventName ?? 'all', playerMock.npcSet);
		}).to.throw(InvalidInputError);
	});
});
