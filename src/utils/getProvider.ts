//* Returns the Provider or throws an Error if not found

import { ethers } from "ethers";

import { networks as rawNetworks } from "../config/config.json";

const networks = rawNetworks as {
	name: string;
	nativeCurrency: string;
	ALCHEMY_URL?: string;
	RPC_URL?: string;
	scan: string;
}[];

// TODO : Use `DefaultProvider` so that the Bot uses Multiple RPC Nodes when possible

module.exports = async (networkName: string): Promise<ethers.providers.JsonRpcProvider> => {
	let networkRPC: string;

	// Loop Over Every Network until the correct network is found
	for (let i = 0; i < networks.length; i++) {
		if (networks[i].name == networkName) {
			networkRPC = networks[i].ALCHEMY_URL ?? networks[i].RPC_URL;
			break;
		}
	}

	if (!networkRPC) {
		throw new Error("Network RPC Not Setup!");
	}

	const provider = new ethers.providers.JsonRpcProvider(networkRPC);
	await provider.ready;
	return provider;
};
