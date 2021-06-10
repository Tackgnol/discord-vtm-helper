import chai, { expect } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { multiMessageMapper } from './multiMessage.mapper';
import { multiMessageMock } from '../../Mocks/SessionDataMocks/MultiMessageMock';

chai.use(jestSnapshotPlugin());

describe('Services >> Mappers >> multiMessageMapper', () => {
	it('properly maps a valid multi message', () => {
		const result = multiMessageMapper(multiMessageMock);
		expect(result).toMatchSnapshot();
		expect(result).to.exist;
	});

	it('throws on missing name', () => {
		expect(() => {
			multiMessageMapper({ ...multiMessageMock, name: undefined });
		}).to.throw(Error);
	});

	it('throws on missing message', () => {
		expect(() => {
			multiMessageMapper({ ...multiMessageMock, message: undefined });
		}).to.throw(Error);
	});

	it('throws on missing userList', () => {
		expect(() => {
			multiMessageMapper({ ...multiMessageMock, userList: undefined });
		}).to.throw(Error);
	});
});
