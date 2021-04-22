import { VoiceConnection } from 'discord.js';

const Play = (connection: VoiceConnection, url: string) => {
	return connection.play(url);
};

const Stop = (connection: VoiceConnection) => {
	connection.dispatcher.destroy();
};

export { Play, Stop };
