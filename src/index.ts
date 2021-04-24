import Discord from 'discord.js';
import { settings } from './config/settings';
import { Auth } from './config/auth';
import initializeService from './Services';
import { IService } from './Services/IService';
import { DiscordClient } from './DiscordClient';
import { isNil } from 'lodash';
import { WebClient } from './WebClient';

declare global {
	namespace NodeJS {
		interface Global {
			service: IService;
		}
	}
}

const discord = new Discord.Client();
const serviceType = settings.eventSource;
const discordClient = new DiscordClient(discord);
const webClient = new WebClient(discordClient);
global.service = initializeService(serviceType);

discord.once('ready', () => {
	console.log('Ready!');
});

discord.on('message', async message => {
	discordClient.processMessage(message);
});

const token = isNil(process.env.token) ? Auth.token : process.env.token;

if (!token) {
	console.error('You need to specify a token in config/auth.ts');
} else {
	discord.login(token);
}

if (settings.allowWebRequests) {
	webClient.listen();
}

// TODO: This was not working and was not converted to TS yet
// app.post('/sound', async (req, res) => {
// 	const { filePath, channelId, command } = req.body;
// 	let manager;
// 	try {
// 		let voiceChannel = find(activeVoiceChannels, vc => vc.id === channelId);
// 		if (isNil(get(voiceChannel, 'connection'))) {
// 			const channel = discordClient.channels.get(channelId);
// 			if (channel.type === 'voice') {
// 				const connection = await channel.join();
// 				manager = new SoundManager(filePath, connection);
// 				voiceChannel = { id: channelId, connection: connection, channel: channel, currentTrack: filePath, manager: manager };
// 				activeVoiceChannels.push(voiceChannel);
// 			}
// 		}
// 		switch (command) {
// 			case settings.soundCommands.playTrack:
// 				voiceChannel.manager.playAmbiance(filePath);
// 				break;
// 			case settings.soundCommands.playSound:
// 				voiceChannel.manager.playSound(filePath);
// 				break;
// 			case settings.soundCommands.stop:
// 				manager = voiceChannel.manager;
// 				activeVoiceChannels.splice(
// 					findIndex(activeVoiceChannels, vc => vc.id === channelId),
// 					1
// 				);
// 				manager.stop();
// 				break;
// 			default:
// 				voiceChannel.manager.stop();
// 				activeVoiceChannels.splice(
// 					findIndex(activeVoiceChannels, vc => vc.id === channelId),
// 					1
// 				);
// 		}
// 		res.send('Success!');
// 	} catch (e) {
// 		res.send(e);
// 	}
// });
