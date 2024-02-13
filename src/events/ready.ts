// Log Printing and setting Discord Presence when the BOT wakes

import { TextChannel } from "discord.js";

import { ExtendedClient } from "../classes/ExtendedClient";
import { channels } from "../config/config.json";

module.exports = {
	name: "ready",
	once: true,
	async execute(client: ExtendedClient) {
		try {
			// Setting Status of Bot
			client.user.setStatus("online");

			// Morning Print of Waking Up
			const logChannel = client.channels.cache.get(channels.log) as TextChannel;
			logChannel.send(
				`[LOGIN/RESTART]\n${new Date(Date.now()).toUTCString()}\nFaucet bot ready.`
			);

			console.log(`Ready! Logged in as ${client.user.tag}`);
		} catch (error) {
			console.error(`Error starting bot: ${error}`);
			const errorChannel = client.channels.cache.get(channels.error) as TextChannel;
			errorChannel.send(
				`[ERROR]\n${new Date(Date.now()).toUTCString()}\nStarting bot\n${error}`
			);
		}
	},
};
