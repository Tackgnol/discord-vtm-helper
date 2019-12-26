const { isEmpty, isNil, isNaN, sortBy, join } = require('lodash');

class GlobalTestManager {
	constructor(message, channel) {
		this.message = message;
		this.channel = channel;
	}

	performTest(testText, replyPrefix, versionOptions, shortCircut, value) {
		const messageChanel = this.channel;
		if (messageChanel.type === 'text') {
			if (value === 0 || isNil(value)) {
				messageChanel.send(testText);
				return;
			}
			let reply;
			if (shortCircut) {
				reply = this.shortCircutedTest(versionOptions, +value);
			} else {
				reply = this.fullTest(versionOptions, +value);
			}
			this.message.author.send(`${replyPrefix}\n\t${reply}`);
		}
	}

	shortCircutedTest(versionOptions, value) {
		if (isEmpty(versionOptions) || isNaN(value)) return;

		const sortedOptions = sortBy(versionOptions, v => -v.minResult);
		for (let i = 0; i <= sortedOptions.length; i++) {
			const currentOption = sortedOptions[i];
			if (currentOption.minResult <= value) {
				return currentOption.resultMessage;
			}
		}
	}

	fullTest(versionOptions, value) {
		if (isEmpty(versionOptions) || isNaN(value)) return;
		const sortedOptions = sortBy(versionOptions, v => v.minResult);
		const messageArray = [];
		sortedOptions.forEach(o => {
			if (o.minResult <= value) {
				messageArray.push(o.resultMessage);
			}
		});
		return !isEmpty(messageArray) && join(messageArray, '\n\t');
	}
}

module.exports = GlobalTestManager;
