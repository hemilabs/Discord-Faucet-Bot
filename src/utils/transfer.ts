//* Returns a transaction object which can be used to transfer to the passed address
// Pass the token Name and Network Name if the transaction is meant to be using a ERC20 token

import * as dotenv from "dotenv";
import { ethers } from "ethers";

import { stats } from "../config/config.json";

dotenv.config();

module.exports = async (
	provider: ethers.providers.JsonRpcProvider,
	usrAddress: string
): Promise<ethers.providers.TransactionResponse> => {
	// Create a wallet instance
	let wallet: ethers.Wallet;

	wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);

	if (!wallet) throw new Error("Wallet Construction Failed!");

	//* Native Transfer
	const nonce = await provider.getTransactionCount(stats.walletAddress); // Get the latest nonce
	let txObj: ethers.providers.TransactionRequest; // Holds the Transaction Object

	txObj = {
		to: usrAddress,
		nonce,
		value: ethers.utils.parseEther(stats.dailyEth.toString()),
		type: 2,
	};

	// Transaction (Call await on the receiving end)
	return await wallet.sendTransaction(txObj);
};
