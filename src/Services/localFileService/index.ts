import { find, isNil } from 'lodash';
import { players } from '../../Resources/players';
import { sessionData } from '../../Resources/events/';
import { IGame, ISessionData } from '../../Models/AppModels';
import { IService } from '../IService';
import { IGlobalTest, INarration, INPC, IPlayer, IStat, IStatInsight, IVersionOption } from '../../Models/GameData';

class LocalFileService implements IService {
	GetPlayer(playerId: string): Promise<IPlayer> {
		const playerData = find(players, p => p.id === playerId);
		if (!isNil(playerData)) {
			return new Promise<IPlayer>((resolve, reject) => {
				resolve(playerData);
			});
		}
		throw new Error('Unable to find player');
	}

	GetEvents(channelId: string): Promise<ISessionData> {
		return new Promise<ISessionData>((resolve, reject) => {
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

	AddFactsToNPC(playerId: string, npc: string, facts: string[]): Promise<INPC> {
		throw new Error('Not available in local mode');
	}

	AddGlobalTest(
		name: string,
		message: string,
		shortCircuit: boolean,
		replyPrefix: string,
		globaltestoptionSet: IVersionOption[]
	): Promise<IGlobalTest> {
		throw new Error('Not available in local mode');
	}

	AddNPC(name: string, callName: string, image: string, description: string): Promise<Omit<INPC, 'facts'>> {
		throw new Error('Not available in local mode');
	}

	AddNarration(name: string, image: string, narrationText: string): Promise<INarration> {
		throw new Error('Not available in local mode');
	}

	AddPlayer(name: string, id: string, statArray: IStat[]): Promise<IPlayer> {
		throw new Error('Not available in local mode');
	}

	AddStatInsight(name: string, stat: string, value: number, message: string): Promise<IStatInsight> {
		throw new Error('Not available in local mode');
	}

	GetUserChannels(userId: string): Promise<IGame[]> {
		throw new Error('Not available in local mode');
	}

	AssignGameAdmin(playerId: string, channelId: string, gameId: string): Promise<ISessionData> {
		throw new Error('Not available in local mode');
	}
}

export default LocalFileService;
