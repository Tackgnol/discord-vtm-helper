import { get } from 'lodash';
import { settings } from '../config/settings';
import { IActiveSession } from '../Models/AppModels';

export const parseCommandMessage = (message: string, activeSession?: IActiveSession) => {
	const expr = /!([a-z]+):? ?(\d+)/i;
	const parsedMessage = expr.exec(message);
	const type = get(parsedMessage, '[1]', null);
	const value = get(parsedMessage, '[2]', null);
	const prevEvent = get(activeSession, 'prevCommand.eventName');
	switch (type) {
		case settings.additionalCommands.test:
			return {
				prefix: settings.prefix,
				type: settings.subPrefixes.globalTest,
				eventName: prevEvent,
				value,
			};
		default:
			return null;
	}
};
