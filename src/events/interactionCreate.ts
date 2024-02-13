//* Handles all kinds of interactions
// Add all new commands build to here

import { Interaction, TextChannel } from "discord.js";
import Keyv from "keyv";

import { ExtendedClient } from "../classes/ExtendedClient";
import { channels } from "../config/config.json";

module.exports = {
	name: "interactionCreate",
	async execute(keyv: Keyv, client: ExtendedClient, interaction: Interaction) {
		try {
			// Gets the Log Channel
			const errorChannel = client.channels.cache.get(channels.error) as TextChannel;

			//* Chat Command Interactions
			if (interaction.isChatInputCommand()) {
				if (interaction.commandName === "faucet-balance") {
					require("../responses/faucet-balance")(interaction);
				} else if (interaction.commandName === "faucet") {
					require("../responses/faucet")(keyv, interaction);
				}
				// Invalid Chat command passed
				else {
					await interaction.reply({
						content: "👀 This Command does not exist!",
						ephemeral: true,
					});
					errorChannel.send(
						`[ERROR]\n${new Date(
							Date.now()
						).toUTCString()}\nInvalid Chat Command Passed\nBy: ${
							interaction.user.username
						}`
					);
					return;
				}
			}
			//* Different kind of interaction
			else {
				errorChannel.send(
					`[ERROR]\n${new Date(
						Date.now()
					).toUTCString()}\nDifferent Kind of Interaction\n${interaction}`
				);
				return;
			}
		} catch (error) {
			const errorChannel = client.channels.cache.get(channels.error) as TextChannel;
			console.error(`Error handling interaction: ${error}`);
			errorChannel.send(
				`[ERROR]\n${new Date(Date.now()).toUTCString()}\nHandling interaction\n${error}`
			);
		}
	},
};
