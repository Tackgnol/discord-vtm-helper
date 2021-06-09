import chai, { expect } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { npcMapper } from './npc.mapper';
import { testNPCWithFacts, testNPCWithoutFacts } from '../../Mocks/SessionDataMocks/NPCMocks';

chai.use(jestSnapshotPlugin());

describe('Services >> Mappers >> npcMapper', () => {
	it('properly maps a valid npc with facts', () => {
		const result = npcMapper(testNPCWithFacts);
		expect(result).toMatchSnapshot();
		expect(result).to.exist;
	});

	it('properly maps a valid npc without facts', () => {
		const result = npcMapper(testNPCWithoutFacts);
		expect(result).toMatchSnapshot();
		expect(result).to.exist;
	});

	it('throws on missing callName', () => {
		expect(() => {
			npcMapper({ ...testNPCWithFacts, callName: undefined });
		}).to.throw(Error);
	});

	it('throws on missing name', () => {
		expect(() => {
			npcMapper({ ...testNPCWithFacts, name: undefined });
		}).to.throw(Error);
	});

	it('throws on missing image', () => {
		expect(() => {
			npcMapper({ ...testNPCWithFacts, image: undefined });
		}).to.throw(Error);
	});

	it('throws on missing description', () => {
		expect(() => {
			npcMapper({ ...testNPCWithFacts, description: undefined });
		}).to.throw(Error);
	});

	it('throws on missing gameId', () => {
		expect(() => {
			npcMapper({ ...testNPCWithFacts, gameId: undefined });
		}).to.throw(Error);
	});
});
