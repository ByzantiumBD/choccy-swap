import { SwapError } from '$lib/errors';
import { calcInput, calcOutput, getCorrectSwapOperation } from '$lib/interactions/routes';
import { calcImpact } from '$lib/interactions/swaps';
import { getCcy, getPairs, getTokenInfo } from '$lib/interactions/utils';
import { makeNumberReadable } from '$lib/number-utils';
import type { TokenInfo } from '$lib/types';
import { getId, isCcy } from '$lib/utils';
import { createAmount, createAmountFromBalance } from '@chromia/ft4';
import { connectionState } from '../shared/connection-state.svelte';
import { liquidityData, orderData, swapData } from './swap-states.svelte';
import { TxRejectedError } from 'postchain-client';
import { replaceState } from '$app/navigation';

const MILLIS_PER_MINUTE = 60 * 1000;
const TEN_SECONDS = 10000;
const QUERY_PARAMS = ['in', 'out'];

let isLastModifiedInput: boolean = $state(true);
let isLastTokenModifiedInput: boolean = $state(true);
let nextUpdate: NodeJS.Timeout | undefined = $state(undefined);
let isSinglePair: boolean = $state(false);

export function setSinglePair(value: boolean) {
	isSinglePair = value;
}

export function getIsLastTokenModifiedInput() {
	return isLastTokenModifiedInput;
}

async function setLpAndOrderData() {
	if (!swapData.pair1 || !swapData.token1 || !swapData.token2) return;
	const lp = await getTokenInfo(swapData.pair1.lpToken);
	liquidityData.lpToken = lp;
	liquidityData.input1 = createAmount(
		liquidityData.input1.toString(),
		swapData.token1.asset.decimals
	);
	liquidityData.input2 = createAmount(
		liquidityData.input2.toString(),
		swapData.token2.asset.decimals
	);

	orderData.input1 = createAmount(orderData.input1.toString(), swapData.token1.asset.decimals);
}

/**
 * switches the token info and all related data to make it so that the swap is on the
 * opposite route as now. Example: CHR -> CCY becomes CCY -> CHR.
 * The last modified input will be moved to the new location, while the other one will
 * be recalculated
 */
export function switchTokens() {
	const t = swapData.token1;
	swapData.token1 = swapData.token2;
	swapData.token2 = t;
	const p = swapData.pair1;
	swapData.pair1 = swapData.pair2 ? swapData.pair2 : swapData.pair1;
	swapData.pair2 = swapData.pair2 ? p : undefined;

	setLpAndOrderData();

	// one of these values will be updated but it's cleaner if it moves
	const v = swapData.input1;
	swapData.input1 = swapData.input2;
	swapData.input2 = v;

	isLastModifiedInput = !isLastModifiedInput;
	isLastTokenModifiedInput = !isLastTokenModifiedInput;
	refreshData();
}
/**
 * updates the swapData with some new token info. Can be a new token or
 * new balance.
 * @param tokenInfo the new token information
 * @param isInput whether the token to update is the input token, isLastModifiedInput
 *                by default
 */
async function updateTokens(tokenInfo: TokenInfo, isInput: boolean = isLastModifiedInput) {
	isLastTokenModifiedInput = isInput;
	function getIdOrNull(id: Buffer | undefined) {
		if (id) return getId(id);
		return null;
	}
	const t1 = getIdOrNull(swapData.token1?.asset.id);
	const t2 = getIdOrNull(swapData.token2?.asset.id);

	const newToken = getIdOrNull(tokenInfo.asset.id);
	const toReplace = isInput ? t1 : t2;
	const other = isInput ? t2 : t1;
	if (toReplace === newToken) {
		// refresh tokens
		if (isInput) swapData.token1 = tokenInfo;
		else swapData.token2 = tokenInfo;
	}
	if (newToken === other) {
		switchTokens();
	} else if (isInput) {
		swapData.token1 = tokenInfo;
		if (
			isSinglePair &&
			!isCcy(tokenInfo.asset) &&
			swapData.token2 &&
			!isCcy(swapData.token2.asset)
		) {
			swapData.token2 = await getTokenInfo(await getCcy());
		}
	} else {
		swapData.token2 = tokenInfo;
		if (
			isSinglePair &&
			!isCcy(tokenInfo.asset) &&
			swapData.token1 &&
			!isCcy(swapData.token1.asset)
		) {
			swapData.token1 = await getTokenInfo(await getCcy());
		}
	}

	if (!swapData.token1 || !swapData.token2) return;
	if (getId(swapData.token1.asset.id) === getId(swapData.token2.asset.id)) {
		swapData.token2 = undefined;
		return;
	}
	const pairs = await getPairs(swapData.token1?.asset, swapData.token2?.asset);
	swapData.pair1 = pairs.pair1;
	swapData.pair2 = pairs.pair2;

	await setLpAndOrderData();

	updateQueryParams();
}
/**
 * Updates the values of the inputs for the swap.
 * @param isInput whether the input to update is the input token for the swap
 */
async function updateValues(isInput: boolean = isLastModifiedInput) {
	isLastModifiedInput = isInput;

	try {
		if (!swapData.token1 || !swapData.token2) return;
		if (isInput) {
			const output = await calcOutput(
				swapData.input1,
				isCcy(swapData.token1.asset),
				swapData.pair1,
				swapData.pair2
			);
			swapData.input2 = output;
		} else {
			const input = await calcInput(
				swapData.input2,
				isCcy(swapData.token1.asset),
				swapData.pair1,
				swapData.pair2
			);
			swapData.input1 = input;
		}
		if (swapData.input1.value !== 0n && swapData.input2.value !== 0n) {
			swapData.impact = Number(
				makeNumberReadable(
					calcImpact(
						swapData.pair1,
						swapData.pair2,
						swapData.input1.value,
						swapData.input2.value,
						isCcy(swapData.token2.asset)
					).toString()
				)
			);
		} else {
			swapData.impact = 0;
		}
	} catch (e) {
		if (e instanceof SwapError && e.message.match('amount does not match')) {
			swapData.input1 = createAmount(
				swapData.input1.toString(),
				swapData.token1?.asset.decimals ?? 18
			);
			swapData.input2 = createAmount(
				swapData.input2.toString(),
				swapData.token2?.asset.decimals ?? 18
			);
		} else throw e;
	}
}

/**
 * Updates all that is needed on the inputs for the swap.
 * @param isInput whether the input to update is the input token for the swap
 * @param tokenInfo new TokenInfo or undefined if it didn't change
 */
export async function updateInputs(isInput?: boolean, tokenInfo?: TokenInfo) {
	connectionState.loading = true;
	clearTimeout(nextUpdate);

	if (tokenInfo) {
		await updateTokens(tokenInfo, isInput);
		if (isInput) {
			swapData.input1 = createAmount(
				swapData.input1.toString(),
				swapData.token1?.asset.decimals ?? 18
			);
		} else {
			swapData.input2 = createAmount(
				swapData.input2.toString(),
				swapData.token2?.asset.decimals ?? 18
			);
		}
	}
	await updateValues(tokenInfo ? undefined : isInput);

	connectionState.loading = false;
	refreshData();
}

export async function refreshData() {
	connectionState.loading = true;
	clearTimeout(nextUpdate);

	if (!connectionState.connection) return;

	if (swapData.token1) {
		swapData.token1 = await getTokenInfo(swapData.token1.asset);
	}
	if (swapData.token2) {
		swapData.token2 = await getTokenInfo(swapData.token2.asset);
	}
	if (swapData.token1 && swapData.token2) {
		const p = await getPairs(swapData.token1.asset, swapData.token2.asset);
		swapData.pair1 = p.pair1;
		swapData.pair2 = p.pair2;

		await setLpAndOrderData();
	}
	await updateValues();

	connectionState.loading = false;
	requestUpdateInputs();
}

export async function swap(successCallback: (msg: string, link: string) => () => void) {
	connectionState.loading = true;
	const session = connectionState.session;
	if (!session) throw new SwapError('Connect before using the dapp');
	if (!swapData.token1) throw new SwapError('Token 1 is not defined');
	if (!swapData.token2) throw new SwapError('Token 2 is not defined');

	const swapDeadline = Date.now() + swapData.settings.deadline * MILLIS_PER_MINUTE;
	const slipPrecision = 100000;
	const slip = BigInt((100 - swapData.settings.slippage) * slipPrecision);

	let sent = false;
	let killAlert = () => {};
	session
		.call(
			getCorrectSwapOperation(
				swapData.pair1,
				swapData.pair2,
				isCcy(swapData.token2.asset),
				swapData.input1,
				createAmountFromBalance(
					(swapData.input2.value * slip) / (100n * BigInt(slipPrecision)),
					swapData.input2.decimals
				),
				swapDeadline
			)
		)
		.on('sent', (txRid) => {
			if (sent) return;
			sent = true;
			const link =
				'https://explorer.chromia.com/testnet/' +
				'FA289E086E3D6C3277336E270BADDF75035C1F049F242AB2CF61773D2822213D/transaction/' +
				getId(txRid);
			killAlert = successCallback('transaction sent, waiting for confirmation...', link);
		})
		.then(async (txWithReceipt) => {
			await refreshData();
			connectionState.loading = false;
			const txRid = txWithReceipt.receipt.transactionRid;
			const link =
				'https://explorer.chromia.com/testnet/' +
				'FA289E086E3D6C3277336E270BADDF75035C1F049F242AB2CF61773D2822213D/transaction/' +
				getId(txRid);
			killAlert();
			successCallback('Swap succeeded!', link);
		})
		.catch((e) => {
			if (
				e instanceof TxRejectedError &&
				e.message.match(/Amount received too small, the price went out of range/i)
			) {
				throw new SwapError(
					'The price of the token changed too suddenly. The swap operation reverted due to your slippage settings.'
				);
			} else throw e;
		});
}

// QueryParams
export async function loadQueryParams() {
	const url = new URL(window.location.href);

	if (
		url.searchParams.get(QUERY_PARAMS[0])?.toLowerCase() ===
		url.searchParams.get(QUERY_PARAMS[1])?.toLowerCase()
	) {
		url.searchParams.delete(QUERY_PARAMS[1]);
	}

	QUERY_PARAMS.forEach(async (p, idx) => {
		const id = url.searchParams.get(p);
		if (id) {
			const asset = await connectionState.connection!.getAssetById(id);
			if (asset) {
				const tkInfo = await getTokenInfo(asset);
				await updateInputs(idx === 0, tkInfo);
			} else {
				url.searchParams.delete(p);
			}
		}
	});
	replaceState(url, {});
}
function updateQueryParams() {
	const ids = [
		getId(swapData.token1?.asset.id ?? Buffer.from('')),
		getId(swapData.token2?.asset.id ?? Buffer.from(''))
	];

	const url = new URL(window.location.href);

	if (url.searchParams.get(QUERY_PARAMS[0]) === url.searchParams.get(QUERY_PARAMS[1])) {
		url.searchParams.delete(QUERY_PARAMS[1]);
	}

	[0, 1].forEach(async (idx) => {
		const id = ids[idx];
		const p = QUERY_PARAMS[idx];
		const oldId = url.searchParams.get(p);

		if (!id && oldId) {
			const asset = await connectionState.connection!.getAssetById(oldId);
			if (asset) {
				const tkInfo = await getTokenInfo(asset);
				updateInputs(idx === 0, tkInfo);
			}
		}
		if (id && url.searchParams.get(p)?.toLowerCase() !== id) {
			url.searchParams.set(p, getId((idx ? swapData.token1 : swapData.token2)!.asset.id));
		}
	});
	replaceState(url, {});
}

export function requestUpdateInputs() {
	cancelUpdate();
	nextUpdate = setTimeout(refreshData, TEN_SECONDS);
}

export function cancelUpdate() {
	clearTimeout(nextUpdate);
}
