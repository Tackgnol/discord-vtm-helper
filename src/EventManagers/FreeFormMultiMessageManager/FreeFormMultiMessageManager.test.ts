import { FreeFormMultiMessageManager } from './FreeFormMultiMessageManager';
import { freeFormMultiMessageErrorMock, freeFormMultiMessageMock } from '../../Mocks/SessionDataMocks/FreeFormMultiMessageMock';
import chai, { expect } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';

chai.use(jestSnapshotPlugin());

describe('EventManagers >> FreeFormMultiMessageManager >> FreeFormMultiMessageManager', () => {
	const manager = new FreeFormMultiMessageManager();

	it('returns a proper message list', () => {
		const { channelMembers, reply, userList } = freeFormMultiMessageMock;
		const result = manager.messageUsers(reply, userList, channelMembers);
		expect(result).toMatchSnapshot();
	});

	it('throws an error on empty user lists', () => {
		const { channelMembers, reply } = freeFormMultiMessageMock;
		expect(() => {
			manager.messageUsers(reply, [], channelMembers);
		}).to.throw;
	});

	it('throws an error on empty channel members', () => {
		const { reply, userList } = freeFormMultiMessageMock;
		expect(() => {
			manager.messageUsers(reply, userList, []);
		}).to.throw;
	});

	it('throws an error if the channel list and user list do not match', () => {
		const { channelMembers, reply, userList } = freeFormMultiMessageErrorMock;
		expect(() => {
			manager.messageUsers(reply, userList, channelMembers);
		}).to.throw;
	});
});
