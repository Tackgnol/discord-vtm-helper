const { isEmpty, isNil, isNaN, sortBy, join } = require('lodash');

class NarrationManager {
	constructor(message) {
		this.message = message;
		this.client = message.client;
    }
    
    displayNarration(narrationText, image = null) {
        const messageChanel = this.message.channel;
        messageChanel.send(`${narrationText} \n ${image}`);
    }

}

module.exports = NarrationManager;