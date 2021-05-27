import { settings } from '../config/settings';

export const isNPCCommand = (type: string = 'none') => {
	return type === settings.subPrefixes.npcs;
};
