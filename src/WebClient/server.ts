import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { TextChannel } from 'discord.js';
import { DiscordClient } from '../DiscordClient';
import { FreeFormMultiMessageManager } from '../EventManagers';

export class WebClient {
	app: Express;
	constructor(private discordClient: DiscordClient) {
		this.app = express();
		this.app.use(bodyParser.urlencoded({ extended: true }));
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.raw());
	}

	listen() {
		this.app.post('/event', async (req, res) => {
			const channel = await this.discordClient.fetchChannel(req.body.channel);
			const gameId = req.body.gameId;

			try {
				await this.discordClient.processChannelMessage(req.body.content, <TextChannel>channel, gameId);
				res.send('Success!');
			} catch (e) {
				res.status(400).send(e);
			}
		});

		this.app.post('/message', async (req, res) => {
			const { message, users, channelId, gameId } = req.body;
			const channel = await this.discordClient.fetchChannel(channelId);
			try {
				const manager = new FreeFormMultiMessageManager();
				if (!channel.isText()) {
					res.status(400).send('The channel is not a text channel ');
				}
				const textChannel = channel as TextChannel;
				const discordMessage = manager.messageUsers(
					message,
					users,
					textChannel.members.map(m => m.id)
				);
				await this.discordClient.send(discordMessage, { channel: textChannel, gameId });
				res.send('Success!');
			} catch (e) {
				res.status(400).send(e);
			}
		});
		this.app.listen(8080, () => {
			console.log('listening now on 8080');
		});
	}
}
