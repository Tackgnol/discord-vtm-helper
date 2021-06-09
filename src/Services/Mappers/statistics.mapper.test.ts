import chai, { expect } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { statisticsMapper } from './statistics.mapper';
import { playerMock } from '../../Mocks/SessionDataMocks/PlayerMock';

chai.use(jestSnapshotPlugin());

describe('Services >> Mappers >> statisticMapper', () => {
	const stat = playerMock.statisticsSet[0];

	it('properly maps a valid stat', () => {
		const result = statisticsMapper(stat);
		expect(result).toMatchSnapshot();
		expect(result).to.exist;
	});

	it('throws on name missing', () => {
		expect(() => {
			statisticsMapper({ ...stat, name: undefined });
		}).to.throw(Error);
	});
	it('throws on value missing', () => {
		expect(() => {
			statisticsMapper({ ...stat, value: undefined });
		}).to.throw(Error);
	});
});
