import chai, { expect } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { statInsightMockHigh } from '../../Mocks/SessionDataMocks/StatInsightMocks';
import { statInsightMapper } from './statInsight.mapper';

chai.use(jestSnapshotPlugin());

describe('Services >> Mappers >> statInsightMapper', () => {
	it('properly maps a valid statInsight', () => {
		const result = statInsightMapper(statInsightMockHigh);
		expect(result).toMatchSnapshot();
		expect(result).to.exist;
	});

	it('throws on name missing', () => {
		expect(() => {
			statInsightMapper({ ...statInsightMockHigh, name: undefined });
		}).to.throw(Error);
	});
	it('throws on statName missing', () => {
		expect(() => {
			statInsightMapper({ ...statInsightMockHigh, statName: undefined });
		}).to.throw(Error);
	});

	it('throws on successMessage missing', () => {
		expect(() => {
			statInsightMapper({ ...statInsightMockHigh, successMessage: undefined });
		}).to.throw(Error);
	});

	it('throws on minValue missing', () => {
		expect(() => {
			statInsightMapper({ ...statInsightMockHigh, minValue: undefined });
		}).to.throw(Error);
	});
});
