import {
	createAppKit,
	type PublicStateControllerState,
	type UseAppKitAccountReturn
} from '@reown/appkit';
import { mainnet, bsc, avalanche } from '@reown/appkit/networks';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import type { Eip1193Provider } from 'ethers';
import { connectWithEvmAccount, disconnect } from './connection';
import { WalletError } from '$lib/errors';
import { connectionState } from '$lib/states/shared/connection-state.svelte';

// Get projectId from https://cloud.reown.com
const projectId = 'bd9f15cbf71849a70415487e71be2bf9';

// Configure the metadata
const metadata = {
	name: 'ChoccySwap',
	description: 'Sweetest DEX on Chromia',
	url: 'https://www.choccyswap.com/', // origin must match your domain & subdomain
	icons: ['https://www.choccyswap.com/logo.svg']
};

// 3. Create the modal
export const modal = createAppKit({
	adapters: [new EthersAdapter()],
	networks: [mainnet, bsc, avalanche],
	metadata,
	projectId,
	features: {
		analytics: true // Optional - defaults to your Cloud configuration
	}
});

modal.subscribeProviders((state) => {
	connectionState.provider = state['eip155'] as Eip1193Provider;
});
modal.subscribeAccount(switchAccount);
modal.subscribeState(updateState);

async function signMessage(msg: string) {
	if (connectionState.provider && connectionState.account?.address) {
		return (await connectionState.provider.request({
			method: 'personal_sign',
			params: [msg, connectionState.account.address]
		})) as string;
	} else {
		throw new WalletError('Please connect before signing a message.');
	}
}

function switchAccount(newState: UseAppKitAccountReturn) {
	connectionState.account = newState;
	if (newState.address && connectionState.provider) {
		connectWithEvmAccount(newState.address, signMessage);
	} else {
		disconnect();
	}
}
async function updateState(newState: PublicStateControllerState) {
	if (
		newState.initialized &&
		modal.getIsConnectedState() &&
		connectionState.account?.address &&
		!newState.loading
	) {
		await connectWithEvmAccount(connectionState.account.address, signMessage)
	}
}

export async function disconnectModal() {
	await modal.disconnect();
	disconnect();
}
