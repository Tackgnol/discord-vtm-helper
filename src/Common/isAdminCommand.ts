import { adminMessages } from './adminMessages';
import { parseEventMessage } from './parseEventMessage';

export const isAdminCommand = (message: string) => {
	const command = parseEventMessage(message);
	const messageToCheck = `${command.prefix}-${command.type}`;
	return adminMessages.includes(messageToCheck);
};
