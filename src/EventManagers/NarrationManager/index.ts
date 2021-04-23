import { IReply, ReplyType } from '../../Models/AppModels';
import { narrationRichEmbed } from '../../Common';

class NarrationManager {
	displayNarration(narrationText: string, image?: string): IReply {
		return { type: ReplyType.Channel, value: narrationRichEmbed(narrationText, image) };
	}
}

export default NarrationManager;
