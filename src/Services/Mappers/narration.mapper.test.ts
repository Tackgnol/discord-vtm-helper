import chai, { expect } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { narrationMapper } from './narration.mapper';
import { basicNarration } from '../../Mocks/SessionDataMocks/NarrationMocks';

chai.use(jestSnapshotPlugin());

describe('Services >> Mappers >> narrationMapper', () => {
	it('properly maps a valid narration', () => {
		const result = narrationMapper(basicNarration);
		expect(result).toMatchSnapshot();
		expect(result).to.exist;
	});

	it('throws on missing name', () => {
		expect(() => {
			narrationMapper({ ...basicNarration, name: undefined });
		}).to.throw(Error);
	});

	it('throws on missing image', () => {
		expect(() => {
			narrationMapper({ ...basicNarration, image: undefined });
		}).to.throw(Error);
	});

	it('throws on missing narrationText', () => {
		expect(() => {
			narrationMapper({ ...basicNarration, narrationText: undefined });
		}).to.throw(Error);
	});
});
