import MultiMessageManager from './MultiMessageManager';
import { multiMessageMock } from '../../Mocks/SessionDataMocks/MultiMessageMock';
import { playerMock } from '../../Mocks/SessionDataMocks/PlayerMock';
import { expect } from 'chai';
import { InvalidInputError } from '../../Common/Errors';

describe('EventManagers >> MultiMessageManager >> MultiMessageManager', () => {
	const manager = new MultiMessageManager();
	it('Returns a message set for users', () => {
		const { message, userList } = multiMessageMock;
		const result = manager.messageUsers([playerMock.id], userList, message);
		expect(result).toMatchSnapshot();
		expect(result.value).to.have.lengthOf(1);
	});

	it('Throws an error if no users are in the channel', () => {
		const { message } = multiMessageMock;
		expect(() => {
			manager.messageUsers([playerMock.id], [], message);
		}).to.throw(InvalidInputError);
	});

	it('Throws an error if no users to send to', () => {
		const { message, userList } = multiMessageMock;
		expect(() => {
			manager.messageUsers([], userList, message);
		}).to.throw(InvalidInputError);
	});
});
