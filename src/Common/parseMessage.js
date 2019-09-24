const { isEmpty, get } = require('lodash');
const settings = require('../../config/settings.json');

const parseMessage = message => {
	const expr = /(!vtm)-([a-z]+)-([a-zA-Z]+) ?([\d]+)?/;
	const parsedMessage = expr.exec(message);
	const prefix = get(parsedMessage, `[${settings.prefixStructure.vtm}]`, null);
	const type = get(
		parsedMessage,
		`[${settings.prefixStructure.eventType}]`,
		null
	);
	const eventName = get(
		parsedMessage,
		`[${settings.prefixStructure.eventName}]`,
		null
	);
	const value = get(parsedMessage, `[${settings.prefixStructure.value}]`, null);
	if (!isEmpty(prefix) && !isEmpty(type) && !isEmpty(eventName)) {
		return {
			prefix,
			type,
			eventName,
			value,
		};
	}
	return null;
};

module.exports = parseMessage;
