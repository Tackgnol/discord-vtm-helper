import { settings } from '../config/settings';

const messagePrefix = `${settings?.prefix}`;

export const adminMessages = [
	`${messagePrefix}-${settings.subPrefixes.globalTest}-`,
	`${messagePrefix}-${settings.subPrefixes.statInsight}-`,
	`${messagePrefix}-${settings.subPrefixes.messageMultiplePlayers}-`,
	`${messagePrefix}-${settings.subPrefixes.narration}-`,
	`${messagePrefix}-${settings.subPrefixes.multiMessenger}`,
	`${messagePrefix}-${settings.subPrefixes.admin}`,
];
