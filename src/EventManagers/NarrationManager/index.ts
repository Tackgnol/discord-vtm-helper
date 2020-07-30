import { narrationRichEmbed } from '../../Common/RichEmbeds';
import { Message, TextChannel } from 'discord.js';

class NarrationManager {
	constructor(private channel: TextChannel, private message?: Message) {
		this.message = message;
		this.channel = channel;
	}

	displayNarration(narrationText: string, image?: string) {
		const messageChanel = this.channel;
		const narration = narrationRichEmbed(narrationText, image);
		messageChanel.send(narration);
	}
}

export default NarrationManager;
