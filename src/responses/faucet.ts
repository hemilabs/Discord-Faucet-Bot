//* Transfers the set dailyEth value to the requested user.

import { ChatInputCommandInteraction, TextChannel } from "discord.js";
import { ethers } from "ethers";
import Keyv from "keyv";

import { channels, networks, stats } from "../config/config.json";

const getBalance = require("../utils/getBalance");
const getExplorerUrl = require("../utils/getExplorerUrl");
const getProvider = require("../utils/getProvider");
const { getTimer, setTimer } = require("../utils/handleRateLimiting");
const transfer = require("../utils/transfer");

module.exports = async (keyv: Keyv, interaction: ChatInputCommandInteraction): Promise<void> => {
	// Initial Response to client
	await interaction.reply({ content: "🤖 Processing...", fetchReply: true });

	try {
		// Setup the log channel
		const logChannel = interaction.client.channels.cache.get(channels.log) as TextChannel;

		// Get the Network,token and address from user input
		const usrAddress = interaction.options.getString("address");
		const networkName = interaction.options.getString("network") ?? networks[0].name;

		// Check whether address is valid
		if (!ethers.utils.isAddress(usrAddress)) {
			await interaction.editReply("😤 Please enter a correct address and try again.");
			return;
		}

		// Get the Provider based on the network
		const provider = (await getProvider(networkName)) as ethers.providers.JsonRpcProvider;

		// If the balance is too low (curBalance is string)
		const curBalance = (await getBalance(provider)) as string;
		if (parseFloat(curBalance) < stats.dailyEth) {
			const addressUrl = `${getExplorerUrl(networkName)}/address/${stats.walletAddress}`;
			await interaction.editReply(
				`😥 Insufficient funds. Please donate to [${stats.walletAddress}](${addressUrl}).`
			);
			return;
		}

		// Rate Limiting for nonce
		const nonceLimit = (await getTimer(interaction, networkName, true, keyv)) as
			| number
			| undefined;
		if (nonceLimit) {
			const timeLeft = Math.floor((stats.globalCoolDown - (Date.now() - nonceLimit)) / 1000);
			await interaction.editReply(`🥶 Please wait for ${timeLeft}s before requesting again.`);
			return;
		}

		// Rate Limiting for non Admins
		const limit = (await getTimer(interaction, networkName, false, keyv)) as number | undefined;
		if (limit) {
			const timeLeft = Math.ceil((stats.coolDownTime - (Date.now() - limit)) / 3600000);
			await interaction.editReply(`😎 Cool people wait ${timeLeft} hours to ask for more.`);
			return;
		} else {
			await setTimer(interaction, networkName, true, keyv);
		}

		// Transaction
		const tx = (await transfer(
			provider,
			usrAddress,
			networkName
		)) as ethers.providers.TransactionResponse;
		const shortHash = `${tx.hash.slice(0, 6)}...${tx.hash.slice(-4)}`;
		const txUrl = `${getExplorerUrl(networkName)}/tx/${tx.hash}`;
		const txLink = `[${shortHash}](${txUrl})`;
		await interaction.editReply(`👨‍🏭 Transaction ${txLink} sent. Please wait...`);
		await tx.wait();
		await setTimer(interaction, networkName, false, keyv);

		// Transfer Success
		logChannel.send(
			`[TRANSFER]\n${new Date(
				Date.now()
			).toUTCString()}\nNetwork: ${networkName.toUpperCase()}\nBy: ${
				interaction.user.username
			}\nTo: ${usrAddress}`
		);

		await interaction.editReply(`💁 Transaction ${txLink} confirmed. Happy coding!`);
	} catch (error) {
		console.error(`Error transferring: ${error}`);
		const errorChannel = interaction.client.channels.cache.get(channels.error) as TextChannel;
		errorChannel.send(`[ERROR]\n${new Date(Date.now()).toUTCString()}\nTransferring\n${error}`);
		await interaction.editReply("🙇‍♂️ Error! Please try again in few minutes.");
	}
};
