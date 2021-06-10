import chai, { expect } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { sessionMapper } from './session.mapper';
import { sessionMock } from '../../Mocks/SessionDataMocks/SessionMock';

chai.use(jestSnapshotPlugin());

describe('Services >> Mappers >> sessionMapper', () => {
	it('properly maps a valid session', () => {
		const result = sessionMapper(sessionMock);
		expect(result).toMatchSnapshot();
		expect(result).to.exist;
	});

	it('throws on missing channelId', () => {
		expect(() => {
			sessionMapper({ ...sessionMock, channelId: undefined });
		}).to.throw(Error);
	});
});
