import { find, isNil } from 'lodash';
import { players } from '../../Resources/players';
import { sessionData } from '../../Resources/events/';
import { Game, SessionData } from '../../Models/AppModels';
import { IService } from '../IService';
import { GlobalTest, Narration, NPC, Option, Player, Stat, StatInsight } from '../../Models/GameData';

class LocalFileService implements IService {
	GetTestByMessageId = (messageId: string) => {
		throw Error('Unimplemented');
	};
	RemovePlayer(playerId: string, gameId: string): Promise<string> {
		throw new Error('Not available in local mode');
	}
	NewGame(admin: string, channelId: string): Promise<Game> {
		throw new Error('Not available in local mode');
	}
	GetPlayer(playerId: string): Promise<Player> {
		const playerData = find(players, p => p.id === playerId);
		if (!isNil(playerData)) {
			return new Promise<Player>((resolve, reject) => {
				resolve(playerData);
			});
		}
		throw new Error('Unable to find player');
	}

	GetEvents(channelId: string): Promise<SessionData> {
		return new Promise<SessionData>((resolve, reject) => {
			if (!sessionData) {
				reject('No data!');
			} else {
				const data = sessionData.find(s => s.channelId === channelId);
				if (data) {
					resolve(data);
				}
			}
		});
	}

	AddFactsToNPC(playerId: string, npc: string, facts: string[]): Promise<NPC> {
		throw new Error('Not available in local mode');
	}

	AddGlobalTest(
		name: string,
		message: string,
		shortCircuit: boolean,
		replyPrefix: string,
		globaltestoptionSet: Option[]
	): Promise<GlobalTest> {
		throw new Error('Not available in local mode');
	}

	AddNPC(name: string, callName: string, image: string, description: string): Promise<Omit<NPC, 'facts'>> {
		throw new Error('Not available in local mode');
	}

	AddNarration(name: string, image: string, narrationText: string): Promise<Narration> {
		throw new Error('Not available in local mode');
	}

	AddPlayer(name: string, id: string, statArray: Stat[]): Promise<Player> {
		throw new Error('Not available in local mode');
	}

	AddStatInsight(name: string, stat: string, value: number, message: string): Promise<StatInsight> {
		throw new Error('Not available in local mode');
	}

	GetUserChannels(userId: string): Promise<Game[]> {
		throw new Error('Not available in local mode');
	}

	AssignGameAdmin(playerId: string, channelId: string, gameId: string): Promise<SessionData> {
		throw new Error('Not available in local mode');
	}

	AssignActiveMessage(messageId: string, testCall: string): Promise<string> {
		throw new Error('Not available in local mode');
	}
}

export default LocalFileService;
