import chai, { expect } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { playerMapper } from './player.mapper';
import { playerMock } from '../../Mocks/SessionDataMocks/PlayerMock';

chai.use(jestSnapshotPlugin());

describe('Services >> Mappers >> playerMapper', () => {
	it('properly maps a valid player', () => {
		const result = playerMapper(playerMock);
		expect(result).toMatchSnapshot();
		expect(result).to.exist;
	});

	it('throws on missing id', () => {
		expect(() => {
			playerMapper({ ...playerMock, id: undefined });
		}).to.throw(Error);
	});

	it('throws on missing discordUserName', () => {
		expect(() => {
			playerMapper({ ...playerMock, discordUserName: undefined });
		}).to.throw(Error);
	});

	it('throws on missing statisticsSet', () => {
		expect(() => {
			playerMapper({ ...playerMock, statisticsSet: undefined });
		}).to.throw(Error);
	});

	it('throws on missing name', () => {
		expect(() => {
			playerMapper({ ...playerMock, npcSet: undefined });
		}).to.throw(Error);
	});
});
