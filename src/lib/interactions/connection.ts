// import type { ChainStats } from "$lib/types";
import {
	MetamaskError,
	MissingAccountError,
	OfflineError,
	TooManyAccountsError
} from '$lib/errors';
import {
	createConnection,
	createWeb3ProviderEvmKeyStore,
	type Eip1193Provider,
	type Connection,
	createKeyStoreInteractor,
	type Session
	// type SessionWithLogout,
	// type LoginOptions,
} from '@chromia/ft4';
import { createClient } from 'postchain-client';

declare global {
	interface Window {
		ethereum?: Eip1193Provider;
	}
}

let connection: Connection | undefined;
export let session: Session | undefined;
// let login: (options: LoginOptions) => Promise<SessionWithLogout> | undefined;
// let chainStats: ChainStats | undefined;

export async function getConnection(): Promise<Connection> {
	if (connection === undefined) {
		const client = await createClient({
			directoryNodeUrlPool: [
				"https://node0.testnet.chromia.com:7740",
				"https://node1.testnet.chromia.com:7740",
				"https://node2.testnet.chromia.com:7740",
				"https://node3.testnet.chromia.com:7740",
			],
			blockchainRid: "fa289e086e3d6c3277336e270baddf75035c1f049f242ab2cf61773d2822213d"
		});

		connection = createConnection(client);
		// chainStats = await client.query("get_chain_stats") as ChainStats;
	}
	return connection;
}

export async function getSessionOrConnect() {
	if (session === undefined) {
		if (window.ethereum === undefined) {
			throw new MetamaskError('Web3 provider not found')
		}
		const connection = await getConnection();
		if (connection === undefined) {
			throw new OfflineError(
				"Couldn't connect to the blockchain. Please try again or reload the page."
			);
		}
		const ks = await createWeb3ProviderEvmKeyStore(window.ethereum);
		const {
			getSession,
			getAccounts
			/*login: newLogin*/
		} = createKeyStoreInteractor(connection.client, ks);

		// login = newLogin

		let accs = await getAccounts();
		if (!accs.length) {
			// throw new MissingAccountError('No account found. Please create one through the Chromia Vault.');
			await connection.client.sendTransaction(
				{name: "create_account", args: [ks.address]}
			)
			accs = await getAccounts();
			if (!accs.length) {
				throw new MissingAccountError('No account found. Account creation failed');
			}
	
		}

		if (accs.length === 1) {
			session = await getSession(accs[0].id);
		} else {
			throw new TooManyAccountsError('Too many accounts found. Please contact us on Telegram.');
		}
	}
	return session;
}

export function getSession() {
	return session;
}