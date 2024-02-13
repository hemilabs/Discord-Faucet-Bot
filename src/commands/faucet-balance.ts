/* 
* Get the Faucet Address balance of the Passed Network and token. If the token is not passed then the default native-currency is used
! ADMINS ONLY
If you change this, make sure to run `pnpm bot:deletecommands && pnpm bot:addcommands`
*/

import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

import { networks } from "../config/config.json";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("faucet-balance")
		.setDescription("Get the balance of the Faucet")
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.addStringOption(option => {
			option.setName("network").setDescription("Select the network").setRequired(true);
			networks.forEach(network => {
				option.addChoices({
					name: `${network.name}`,
					value: `${network.name}`,
				});
			});
			return option;
		}),
};
