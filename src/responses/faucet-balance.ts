//* Returns the balance of the Faucet Account in native Currency or the token passed

import { ChatInputCommandInteraction, TextChannel } from "discord.js";
import { ethers } from "ethers";

import { channels, networks } from "../config/config.json";

const getBalance = require("../utils/getBalance");
const getProvider = require("../utils/getProvider");

module.exports = async (interaction: ChatInputCommandInteraction): Promise<void> => {
	// Initial Response to client
	await interaction.reply({ content: "👩‍💻 Querying...", fetchReply: true });

	try {
		let balance: string; // Holds the final balance (string)

		// Get the Network and token from user input
		const networkName = interaction.options.getString("network") ?? networks[0].name;
		let suffix: string;

		// Get the Provider based on the network
		const provider = (await getProvider(networkName)) as ethers.providers.JsonRpcProvider;

		balance = await getBalance(provider);

		// Get Suffix
		for (let i = 0; i < networks.length; i++) {
			if (networkName == networks[i].name) {
				suffix = networks[i].nativeCurrency;
				break;
			}
		}

		// Rounding off the value
		const balanceFinal = balance
			.toString()
			.slice(0, balance.toString().indexOf(".") + 3) // Keep only 2 decimals.
			.replace(/\.0$/, ""); // Remove the trailing ".0" if any.

		// Printing the value out
		await interaction.editReply(
			`🤑 My balance in ${networkName} is ${balanceFinal} ${suffix}.`
		);
	} catch (error) {
		console.error(`Error getting balance: ${error}`);
		const errorChannel = interaction.client.channels.cache.get(channels.error) as TextChannel;
		errorChannel.send(
			`[ERROR]\n${new Date(Date.now()).toUTCString()}\nGetting balance\n${error}`
		);
		await interaction.editReply("🙇‍♂️ Error! Please try again later.");
	}
};
