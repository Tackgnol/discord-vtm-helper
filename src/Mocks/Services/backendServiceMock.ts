import { IService } from '../../Services/IService';
import { IGlobalTest, INarration, INPC, IPlayer, IStat, IStatInsight, IVersionOption } from '../../Models/GameData';
import { IGame, ISessionData } from '../../Models/AppModels';
import { testNPCWithFacts, testNPCWithoutFacts } from '../SessionDataMocks/NPCMocks';
import { globalTestWithShortCircuitMock } from '../SessionDataMocks/GlobalTestMocks';
import { basicNarration } from '../SessionDataMocks/NarrationMocks';
import { playerMock } from '../SessionDataMocks/PlayerMock';
import { statInsightMock } from '../SessionDataMocks/StatInsightMocks';
import { activeSessionMock } from '../SessionDataMocks/ActiveSessionMock';
import { gameMock } from '../GameMock';

export class BackendServiceMock implements IService {
	AddFactsToNPC(playerId: string, npc: string, facts: string[], gameId: string): Promise<INPC> {
		if (!(playerId || npc || facts || gameId)) {
			return Promise.reject('Insufficient data passed');
		}
		return Promise.resolve({ ...testNPCWithFacts, facts: [...testNPCWithFacts.facts, ...facts] });
	}

	AddGlobalTest(
		name: string,
		message: string,
		shortCircuit: boolean,
		replyPrefix: string,
		globaltestoptionSet: IVersionOption[],
		channelId: string,
		gameId: string
	): Promise<IGlobalTest> {
		if (!(name || message || shortCircuit || replyPrefix || globaltestoptionSet || channelId || gameId)) {
			return Promise.reject('Insufficient data passed');
		}
		return Promise.resolve(globalTestWithShortCircuitMock);
	}

	AddNPC(name: string, callName: string, image: string, description: string, gameId: string): Promise<Omit<INPC, 'facts'>> {
		if (!(name || callName || image || description || gameId)) {
			return Promise.reject('Insufficient data passed');
		}
		return Promise.resolve(testNPCWithoutFacts);
	}

	AddNarration(name: string, image: string, narrationText: string, channelId: string, gameId: string): Promise<INarration> {
		if (!(name || image || narrationText || channelId || gameId)) {
			return Promise.reject('Insufficient data passed');
		}
		return Promise.resolve(basicNarration);
	}

	AddPlayer(name: string, id: string, statArray: IStat[], gameId: string): Promise<IPlayer> {
		if (!(name || id || statArray || gameId)) {
			return Promise.reject('Insufficient data passed');
		}
		return Promise.resolve(playerMock);
	}

	AddStatInsight(
		name: string,
		stat: string,
		value: number,
		message: string,
		channelId: string,
		gameId: string
	): Promise<IStatInsight> {
		if (!(name || stat || value || message || channelId || gameId)) {
			return Promise.reject('Insufficient data passed');
		}
		return Promise.resolve(statInsightMock);
	}

	AssignGameAdmin(playerId: string, channelId: string, gameId: string): Promise<ISessionData> {
		if (!(playerId || channelId || gameId)) {
			Promise.reject('Insufficient data passed');
		}
		return Promise.resolve(activeSessionMock);
	}

	GetEvents(channelId: string, gameId: string): Promise<ISessionData> {
		if (!(channelId || gameId)) {
			return Promise.reject('Insufficient data passed');
		}
		return Promise.resolve(activeSessionMock);
	}

	GetPlayer(playerId: string, gameId: string): Promise<IPlayer> {
		if (!(playerId || gameId)) {
			return Promise.reject('Insufficient data passed');
		}
		return Promise.resolve(playerMock);
	}

	GetUserChannels(userId: string): Promise<IGame[]> {
		if (!userId) {
			Promise.reject('Insufficient data passed');
		}
		return Promise.resolve([gameMock]);
	}
}
