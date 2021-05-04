import { IReply, ReplyType } from '../../Models/AppModels';
import { narrationRichEmbed } from '../../Common';
import { InvalidInputError } from '../../Common/Errors';

class NarrationManager {
	displayNarration(narrationText: string, image?: string): IReply {
		if (narrationText.length === 0) {
			throw new InvalidInputError('No text narration to display');
		}
		return { type: ReplyType.Channel, value: narrationRichEmbed(narrationText, image) };
	}
}

export default NarrationManager;
