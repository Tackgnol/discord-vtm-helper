import NarrationManager from './NarrationManager';
import { basicNarration } from '../../Mocks/SessionDataMocks/NarrationMocks';
import { expect } from 'chai';

describe('EventManagers >> NarrationManager >> NarrationManager', () => {
	const manager = new NarrationManager();
	const { narrationText, image } = basicNarration;

	it('generates a proper narration', () => {
		const result = manager.displayNarration(narrationText, image);
		expect(result).toMatchSnapshot();
	});

	it('throws an error if no text is provided', () => {
		expect(() => {
			manager.displayNarration('', image);
		}).to.throw;
	});
});
