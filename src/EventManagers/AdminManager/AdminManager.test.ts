import { AdminManager } from './AdminManager';
import { BackendServiceMock } from '../../Mocks/Services/backendServiceMock';
import {
	faileAddPlayerNameOnlyQuery,
	failedAddFact,
	failedAddFactMissingFact,
	failedAddFactNameOnly,
	failedAddGlobalTest,
	failedAddGlobalTestMissingOptions,
	failedAddGlobalTestMissingOptionsAndPrefix,
	failedAddGlobalTestNameOnly,
	failedAddNarrationMissingMessage,
	failedAddNarrationNameOnly,
	failedAddNPC,
	failedAddNPCMissingDescription,
	failedAddNPCMissingDescriptionAndImage,
	failedAddNPCNameOnly,
	failedAddPlayerMissingQuery,
	failedAddPlayerQuery,
	failedAddStatInsightMissingMessage,
	failedAddStatInsightMissingStat,
	failedAddStatInsightNameOnly,
	successfulAddFact,
	successfulAddPlayerQueryList,
	successfulAddPlayerQueryObject,
	successfulAssignAdmin,
	successfullAddNPC,
	successfullyAddGlobalTest,
	successfullyAddNarration,
	successfullyAddStatInsight,
} from '../../Mocks/QueryMocks/adminQueries';
import chai, { expect } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';

chai.use(jestSnapshotPlugin());

describe('EventManagers >>  AdminManager >> AdminManager', () => {
	const service = new BackendServiceMock();
	const manager = new AdminManager(service);

	it('successfully adds a player with a serial stat', async () => {
		const { value, eventName } = successfulAddPlayerQueryList;
		const result = await manager.fireEvent(eventName ?? '', value ?? '', 'x', '0', '0');
		expect(result.value).to.be.not.null;
		expect(result).toMatchSnapshot();
	});

	it('successfully adds a player with a object stat', async () => {
		const { value, eventName } = successfulAddPlayerQueryObject;
		const result = await manager.fireEvent(eventName ?? '', value ?? '', 'x', '0', '0');
		expect(result).toMatchSnapshot();
	});

	it('throws an error while missing stats', () => {
		const { value, eventName } = failedAddPlayerMissingQuery;
		expect(() => {
			manager.fireEvent(eventName ?? '', value ?? '', 'x', '0', '0');
		}).to.throw;
	});

	it('throws an error on invalid value', () => {
		const { value, eventName } = failedAddPlayerQuery;
		expect(() => {
			manager.fireEvent(eventName ?? '', value ?? '', 'x', '0', '0');
		}).to.throw;
	});

	it('throws an error only name is given', () => {
		const { value, eventName } = faileAddPlayerNameOnlyQuery;
		expect(() => {
			manager.fireEvent(eventName ?? '', value ?? '', 'x', '0', '0');
		}).to.throw;
	});

	it('Successfully adds a npc with a proper query', () => {
		const { value, eventName } = successfullAddNPC;
		const result = manager.fireEvent(eventName ?? '', value ?? '', 'x', '0', '0');
		expect(result).toMatchSnapshot();
		expect(result).to.not.be.null;
	});

	it('Fails to add a npc with a wrong query', () => {
		const { value, eventName } = failedAddNPC;
		expect(() => {
			manager.fireEvent(eventName ?? '', value ?? '', 'x', '0', '0');
		}).to.throw;
	});

	it('Fails to add a npc with a missing description', () => {
		const { value, eventName } = failedAddNPCMissingDescription;
		expect(() => {
			manager.fireEvent(eventName ?? '', value ?? '', 'x', '0', '0');
		}).to.throw;
	});

	it('Fails to add a npc with a missing description and image', () => {
		const { value, eventName } = failedAddNPCMissingDescriptionAndImage;
		expect(() => {
			manager.fireEvent(eventName ?? '', value ?? '', 'x', '0', '0');
		}).to.throw;
	});

	it('Fails to add a npc with a wrong query', () => {
		const { value, eventName } = failedAddNPCNameOnly;
		expect(() => {
			manager.fireEvent(eventName ?? '', value ?? '', 'x', '0', '0');
		}).to.throw;
	});

	it('should add a Fact on a proper input', async () => {
		const { value, eventName } = successfulAddFact;
		const result = await manager.fireEvent(eventName ?? '', value ?? '', '0', '0', '0');
		expect(result).toMatchSnapshot();
		expect(result.value).length.above(0);
	});

	it('should fail to add a Fact on a invalid input', async () => {
		const { value, eventName } = failedAddFact;
		expect(() => {
			manager.fireEvent(eventName ?? '', value ?? '', '0', '0', '0');
		}).to.throw;
	});

	it('should fail to add a Fact on a missing fact list', async () => {
		const { value, eventName } = failedAddFactMissingFact;
		expect(() => {
			manager.fireEvent(eventName ?? '', value ?? '', '0', '0', '0');
		}).to.throw;
	});

	it('should fail to add a Fact on name only', async () => {
		const { value, eventName } = failedAddFactNameOnly;
		expect(() => {
			manager.fireEvent(eventName ?? '', value ?? '', '0', '0', '0');
		}).to.throw;
	});

	it('Successfully adds a new global test on a proper input', async () => {
		const { value, eventName } = successfullyAddGlobalTest;
		const result = await manager.fireEvent(eventName ?? '', value ?? '', '0', '0', '0');
		expect(result).toMatchSnapshot();
		expect(result.value).length.above(0);
	});

	it('Fails to add a new global test on a invalid input', async () => {
		const { value, eventName } = failedAddGlobalTest;
		expect(async () => {
			await manager.fireEvent(eventName ?? '', value ?? '', '0', '0', '0');
		}).to.throw;
	});

	it('Fails to add a new global test on a invalid input - missing options', async () => {
		const { value, eventName } = failedAddGlobalTestMissingOptions;
		expect(async () => {
			await manager.fireEvent(eventName ?? '', value ?? '', '0', '0', '0');
		}).to.throw;
	});

	it('Fails to add a new global test on a invalid input - missing options and prefix', async () => {
		const { value, eventName } = failedAddGlobalTestMissingOptionsAndPrefix;
		expect(async () => {
			await manager.fireEvent(eventName ?? '', value ?? '', '0', '0', '0');
		}).to.throw;
	});

	it('Fails to add a new global test on a invalid input - name only', async () => {
		const { value, eventName } = failedAddGlobalTestNameOnly;
		expect(async () => {
			await manager.fireEvent(eventName ?? '', value ?? '', '0', '0', '0');
		}).to.throw;
	});

	it('Successfully adds a stat insight on a proper input', async () => {
		const { value, eventName } = successfullyAddStatInsight;
		const result = await manager.fireEvent(eventName ?? '', value ?? '', '0', '0', '0');
		expect(result).toMatchSnapshot();
		expect(result.value).length.above(0);
	});

	it('Fails to add a new stat insight on a invalid input - missing message', async () => {
		const { value, eventName } = failedAddStatInsightMissingMessage;
		expect(async () => {
			await manager.fireEvent(eventName ?? '', value ?? '', '0', '0', '0');
		}).to.throw;
	});

	it('Fails to add a new stat insight on a invalid input - missing message and stats', async () => {
		const { value, eventName } = failedAddStatInsightMissingStat;
		expect(async () => {
			await manager.fireEvent(eventName ?? '', value ?? '', '0', '0', '0');
		}).to.throw;
	});

	it('Fails to add a new stat insight on a invalid input - name only', async () => {
		const { value, eventName } = failedAddStatInsightNameOnly;
		expect(async () => {
			await manager.fireEvent(eventName ?? '', value ?? '', '0', '0', '0');
		}).to.throw;
	});

	it('Successfully adds  a Narration on proper input', async () => {
		const { value, eventName } = successfullyAddNarration;
		const result = await manager.fireEvent(eventName ?? '', value ?? '', '0', '0', '0');
		expect(result).toMatchSnapshot();
		expect(result.value).length.above(0);
	});

	it('Fails to add a new Narration on a invalid input - missing message', async () => {
		const { value, eventName } = failedAddNarrationMissingMessage;
		expect(async () => {
			await manager.fireEvent(eventName ?? '', value ?? '', '0', '0', '0');
		}).to.throw;
	});

	it('Fails to add a new Narration on a invalid input - name only', async () => {
		const { value, eventName } = failedAddNarrationNameOnly;
		expect(async () => {
			await manager.fireEvent(eventName ?? '', value ?? '', '0', '0', '0');
		}).to.throw;
	});

	it('assigns the admin to a channel', async () => {
		const { eventName } = successfulAssignAdmin;
		const result = await manager.fireEvent(eventName ?? '', '', '0', '0', '0');
		expect(result).toMatchSnapshot();
		expect(result.value).length.above(0);
	});
});
