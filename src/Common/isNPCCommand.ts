import { parseEventMessage } from './parseEventMessage';
import { settings } from '../config/settings';

export const isNPCCommand = (message: string) => {
	const command = parseEventMessage(message);
	const messageToCheck = `${command.prefix}-${command.type}-`;
	return messageToCheck === `${settings.prefix}-${settings.subPrefixes.npcs}-`;
};
