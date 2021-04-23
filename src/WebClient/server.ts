import express, {Express} from "express";
import bodyParser from "body-parser";
import {TextChannel} from "discord.js";
import {FreeFormMessageMultiplePlayersHandler} from "../Handlers";
import {DiscordClient} from "../DiscordClient";

export class WebClient {

	app: Express;
	constructor(private  discordClient: DiscordClient) {
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
					this.discordClient.processChannelMessage(req.body.content, <TextChannel>channel, gameId);
					res.send('Success!');
				} catch (e) {
					res.send(e);
				}
			});

			this.app.post('/message', async (req, res) => {
				const { message, users, channelId } = req.body;
				const channel = await this.discordClient.fetchChannel(channelId);
				try {
					const handler = new FreeFormMessageMultiplePlayersHandler(users, <TextChannel>channel, message);
					handler.handle();
					res.send('Success!');
				} catch (e) {
					res.send(e);
				}
		});
		this.app.listen(8080, () => {
			console.log('listening now on 8080');
		});
	}
}
