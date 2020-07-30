import { VoiceConnection } from 'discord.js';

const Play = (connection: VoiceConnection, url: string) => {
	return connection.playFile(url);
};

const Stop = (connection: VoiceConnection) => {
	connection.player.dispatcher.end();
};

export { Play, Stop };
