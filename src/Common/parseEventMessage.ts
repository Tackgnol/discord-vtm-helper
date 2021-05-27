import InvalidInputError from './Errors/InvalidInputError';
import { settings } from '../config/settings';
import { Event } from '../Models/GameData';

export const parseEventMessage = (message: string): Partial<Event> => {
	const expr = /(!vtm)-([a-z]+)-([a-zA-Z]+) ?(.+)?/;
	const parsedMessage = expr.exec(message);
	const prefix = parsedMessage?.[settings.prefixStructure.vtm];
	const type = parsedMessage?.[settings.prefixStructure.eventType];
	const eventName = parsedMessage?.[settings.prefixStructure.eventName];
	const value = parsedMessage?.[settings.prefixStructure.value];
	if (!prefix || !type || !eventName) {
		throw new InvalidInputError('prefix, type or event name missing');
	}
	const parsed: Partial<Event> = {
		prefix,
		type,
		eventName,
	};
	if (value) {
		parsed.value = value;
	}
	return parsed;
};
