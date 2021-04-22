import NPCManager from './NPCManager';
import { expect } from 'chai';

describe('Managers > NPCManager test', () => {
	const npcData = [
		{
			npc: {
				name: 'test',
				description: 'this is a description',
				image: 'image',
				facts: ['fact1', 'fact2'],
				callName: 'test',
			},
			facts: ['fact1'],
		},
		{
			npc: {
				name: 'testy',
				description: 'this is a description for the second',
				image: '',
				facts: ['fact3', 'fact4'],
				callName: 'testy',
			},
			facts: ['fact4'],
		},
	];
	const npcManager = new NPCManager();
	it('returns a requested npc', () => {
		const result = npcManager.oneNPC(npcData, 'testy');
		expect(result).to.deep.eq({
			npc: {
				name: 'testy',
				description: 'this is a description for the second',
				image: '',
				facts: ['fact3', 'fact4'],
				callName: 'testy',
			},
			facts: ['fact4'],
		});
	});

	it('returns all npc on asking', () => {
		const result = npcManager.allNPCs(npcData);
		expect(result).to.deep.eq(npcData);
	});
});
