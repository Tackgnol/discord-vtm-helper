import { BackendServiceMock } from '../../Mocks/Services/backendServiceMock';
import StatInsightManager from './StatInsightManager';
import { statInsightMockHigh, statInsightMockLow } from '../../Mocks/SessionDataMocks/StatInsightMocks';
import { playerMock } from '../../Mocks/SessionDataMocks/PlayerMock';
import { expect } from 'chai';
import { InvalidInputError } from '../../Common/Errors';

describe('EventManagers >> StatInsightManager >> StatInsightManager', () => {
	const service = new BackendServiceMock();
	const manager = new StatInsightManager(service);
	it('Returns an array of passing players if there are passing players', async () => {
		const { statName, successMessage, minValue } = statInsightMockLow;
		const result = await manager.checkStat(statName, minValue, successMessage, 'test', [playerMock.id]);
		expect(result.value.length).to.not.eq(0);
		expect(result).toMatchSnapshot();
	});
	it('Returns an empty array if no players are passing', async () => {
		const { statName, successMessage, minValue } = statInsightMockHigh;
		const result = await manager.checkStat(statName, minValue, successMessage, 'test', [playerMock.id]);
		expect(result.value.length).to.eq(0);
		expect(result).toMatchSnapshot();
	});
	it('Throws an error if there are no players to test', () => {
		const { statName, successMessage, minValue } = statInsightMockLow;
		expect(manager.checkStat(statName, minValue, successMessage, 'test', [])).to.be.rejectedWith(InvalidInputError);
	});
});
