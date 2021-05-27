import { adminMessages } from './adminMessages';

export const isAdminCommand = (type: string = 'none') => {
	return adminMessages.includes(type);
};
