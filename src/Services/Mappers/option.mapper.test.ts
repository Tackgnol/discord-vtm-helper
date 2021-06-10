import chai, { expect } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { optionMapper } from './option.mapper';
import { globalTestWithShortCircuitMock } from '../../Mocks/SessionDataMocks/GlobalTestMocks';

chai.use(jestSnapshotPlugin());

describe('Services >> Mappers >> optionMapper', () => {
	const option = globalTestWithShortCircuitMock.globaltestoptionSet[0];
	it('properly maps a valid optionSet', () => {
		const result = optionMapper(option);
		expect(result).toMatchSnapshot();
		expect(result).to.exist;
	});

	it('throws on missing minResult', () => {
		expect(() => {
			optionMapper({ ...option, minResult: undefined });
		}).to.throw(Error);
	});

	it('throws on missing resultMessage', () => {
		expect(() => {
			optionMapper({ ...option, resultMessage: undefined });
		}).to.throw(Error);
	});
});
