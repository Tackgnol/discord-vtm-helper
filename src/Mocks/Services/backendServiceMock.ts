import { IService } from '../../Services/IService';
import { GlobalTest, Narration, NPC, Player, Stat, StatInsight, Option } from '../../Models/GameData';
import { Game, SessionData } from '../../Models/AppModels';
import { testNPCWithFacts, testNPCWithoutFacts } from '../SessionDataMocks/NPCMocks';
import { globalTestWithShortCircuitMock } from '../SessionDataMocks/GlobalTestMocks';
import { basicNarration } from '../SessionDataMocks/NarrationMocks';
import { playerMock } from '../SessionDataMocks/PlayerMock';
import { statInsightMockLow } from '../SessionDataMocks/StatInsightMocks';
import { activeSessionMock } from '../SessionDataMocks/ActiveSessionMock';
import { gameMock } from '../GameMock';

export class BackendServiceMock implements IService {
	AddFactsToNPC(playerId: string, npc: string, facts: string[], gameId: string): Promise<NPC> {
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
		globaltestoptionSet: Option[],
		channelId: string,
		gameId: string
	): Promise<GlobalTest> {
		if (!(name || message || shortCircuit || replyPrefix || globaltestoptionSet || channelId || gameId)) {
			return Promise.reject('Insufficient data passed');
		}
		return Promise.resolve(globalTestWithShortCircuitMock);
	}

	AddNPC(name: string, callName: string, image: string, description: string, gameId: string): Promise<Omit<NPC, 'facts'>> {
		if (!(name || callName || image || description || gameId)) {
			return Promise.reject('Insufficient data passed');
		}
		return Promise.resolve(testNPCWithoutFacts);
	}

	AddNarration(name: string, image: string, narrationText: string, channelId: string, gameId: string): Promise<Narration> {
		if (!(name || image || narrationText || channelId || gameId)) {
			return Promise.reject('Insufficient data passed');
		}
		return Promise.resolve(basicNarration);
	}

	AddPlayer(name: string, id: string, statArray: Stat[], gameId: string): Promise<Player> {
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
	): Promise<StatInsight> {
		if (!(name || stat || value || message || channelId || gameId)) {
			return Promise.reject('Insufficient data passed');
		}
		return Promise.resolve(statInsightMockLow);
	}

	AssignGameAdmin(playerId: string, channelId: string, gameId: string): Promise<SessionData> {
		if (!(playerId || channelId || gameId)) {
			Promise.reject('Insufficient data passed');
		}
		return Promise.resolve(activeSessionMock);
	}

	GetEvents(channelId: string, gameId: string): Promise<SessionData> {
		if (!(channelId || gameId)) {
			return Promise.reject('Insufficient data passed');
		}
		return Promise.resolve(activeSessionMock);
	}

	GetPlayer(playerId: string, gameId: string): Promise<Player> {
		if (!(playerId || gameId)) {
			return Promise.reject('Insufficient data passed');
		}
		return Promise.resolve(playerMock);
	}

	GetUserChannels(userId: string): Promise<Game[]> {
		if (!userId) {
			Promise.reject('Insufficient data passed');
		}
		return Promise.resolve([gameMock]);
	}
}
