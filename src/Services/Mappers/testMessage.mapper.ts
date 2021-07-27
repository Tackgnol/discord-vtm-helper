import { MessageTest } from '../../Models/GameData';
import { checkType } from './utils';

export const testMessageMapper = (object: any): MessageTest => {
	checkType<MessageTest>(object, 'testCall', 'string');
	checkType<MessageTest>(object, 'messageId', 'string');
	checkType<MessageTest>(object, 'gameId', 'string');

	return {
		testCall: object?.testCall,
		messageId: object?.messageId,
		gameId: object?.gameId,
	};
};
