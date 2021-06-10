import { IMultiPlayerMessage } from '../../Models/GameData';
import { checkArray, checkType } from './utils';

export const multiMessageMapper = (object: any): IMultiPlayerMessage => {
	checkType<IMultiPlayerMessage>(object, 'message', 'string');
	checkType<IMultiPlayerMessage>(object, 'name', 'string');
	checkArray(object?.userList, 'string');
	return {
		message: object?.message,
		name: object?.name,
		userList: object?.userList,
	};
};
