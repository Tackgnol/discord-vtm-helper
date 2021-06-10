import { gameMapper } from './game.mapper';
import { gameMock } from '../../Mocks/GameMock';
import chai, { expect } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';

chai.use(jestSnapshotPlugin());

describe('Services >> Mappers > gameMapper', () => {
	it('maps a game on proper data input', () => {
		const result = gameMapper(gameMock);
		expect(result).toMatchSnapshot();
		expect(result.channels).to.have.length.above(0);
		expect(result.players).to.have.length.above(0);
	});

	it('throws an error on missing gameId', () => {
		const faultyGameMock = { ...gameMock, id: undefined };
		expect(() => {
			gameMapper(faultyGameMock);
		}).to.throw(Error);
	});

	it('throws an error on missing adminId', () => {
		const faultyGameMock = { ...gameMock, adminId: undefined };
		expect(() => {
			gameMapper(faultyGameMock);
		}).to.throw(Error);
	});

	it('throws an error on missing current', () => {
		const faultyGameMock = { ...gameMock, current: undefined };
		expect(() => {
			gameMapper(faultyGameMock);
		}).to.throw(Error);
	});
	it('throws an error on missing active channel', () => {
		const faultyGameMock = { ...gameMock, activeChannel: undefined };
		expect(() => {
			gameMapper(faultyGameMock);
		}).to.throw(Error);
	});

	it('throws an error on missing channels', () => {
		const faultyGameMock = { ...gameMock, channels: undefined };
		expect(() => {
			gameMapper(faultyGameMock);
		}).to.throw(Error);
	});

	it('throws an error on missing players', () => {
		const faultyGameMock = { ...gameMock, players: undefined };
		expect(() => {
			gameMapper(faultyGameMock);
		}).to.throw(Error);
	});
});
