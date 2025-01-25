import { SwapError } from '$lib/errors';
import { getCcy, getLpTokenInfo, getTokenInfo } from '$lib/interactions/utils';
import { getId, isCcy } from '$lib/utils';
import {
	createAmount,
	createAmountFromBalance,
	op,
} from '@chromia/ft4';
import { connectionState } from '../shared/connection-state.svelte';
import { liquidityData, swapData } from './swap-states.svelte';
import { calcLpTokensFromAmountInOrOut, calcLiqProvision } from '$lib/interactions/liquidity';
import { cancelUpdate, getIsLastTokenModifiedInput, updateInputs as updateSwapInputs } from './swap-state-interactions.svelte';

const TWENTY_SECONDS = 20000;

let isLastModifiedInput: boolean = $state(true);
let nextUpdate: NodeJS.Timeout | undefined = $state(undefined);

/**
 * Updates the values of the inputs for the liquidity.
 * @param isInput whether the input to update is the input token for the liquidity
 */
async function updateValues(isInput: boolean = isLastModifiedInput) {
	isLastModifiedInput = isInput;
	if (!swapData.pair1 || !swapData.token1 || !swapData.token2) return;
	const isCcy1 = isCcy(swapData.token1.asset);
	
	const liq1 = isCcy1 ? swapData.pair1.amountCcy : swapData.pair1.amount1;
	const liq2 = isCcy1 ? swapData.pair1.amount1 : swapData.pair1.amountCcy;

	try {
		if (!isInput) {
			const amounts = calcLiqProvision(
				liquidityData.input2.value,
				liq2,
				liq1,
			);
			const amount1 = createAmountFromBalance(
				amounts[1],
				swapData.token1.asset.decimals
			);
			const amount2 = createAmountFromBalance(
				amounts[0],
				swapData.token2.asset.decimals
			);
			liquidityData.input1 = amount1;
			liquidityData.input2 = amount2;
		} else {
			const amounts = calcLiqProvision(
				liquidityData.input1.value,
				liq1,
				liq2,
			);
			const amount1 = createAmountFromBalance(
				amounts[0],
				swapData.token1.asset.decimals
			);
			const amount2 = createAmountFromBalance(
				amounts[1],
				swapData.token2.asset.decimals
			);
			liquidityData.input1 = amount1;
			liquidityData.input2 = amount2;
		}
		if (liquidityData.input1.value !== 0n && liquidityData.input2.value !== 0n) {
			const lpAmount = calcLpTokensFromAmountInOrOut(
				liquidityData.input1.value,
				swapData.pair1,
				isCcy(swapData.token1.asset)
			);
			const lpSupply = swapData.pair1.lpToken.supply;
			if (liquidityData.add) {
				liquidityData.share = Number(lpAmount) / Number(lpAmount + lpSupply);
			} else {
				liquidityData.share = Number(lpAmount) / Number(lpSupply);
			}
		} else {
			liquidityData.share = 0;
		}
	} catch (e) {
		if (e instanceof SwapError && e.message.match('amount does not match')) {
			liquidityData.input1 = createAmount(
				liquidityData.input1.toString(),
				swapData.token1.asset.decimals
			);
			liquidityData.input2 = createAmount(
				liquidityData.input2.toString(),
				swapData.token2.asset.decimals
			);
		} else throw e;
	}
}

export async function ensureCorrectPair() {
	connectionState.loading = true;
	const isInput = getIsLastTokenModifiedInput();

	const assetToStay = isInput ? swapData.token1?.asset : swapData.token2?.asset;
	const assetToChange = isInput ? swapData.token2?.asset : swapData.token1?.asset;

	if (!assetToChange || !assetToStay) return
	if (isCcy(assetToStay) || isCcy(assetToChange)) return
	await updateSwapInputs(!isInput, await getTokenInfo(await getCcy()));
	cancelUpdate();

	liquidityData.input1 = createAmount(
		liquidityData.input1.toString(),
		swapData.token1?.asset.decimals ?? 18
	);
	liquidityData.input2 = createAmount(
		liquidityData.input2.toString(),
		swapData.token2?.asset.decimals ?? 18
	);
	connectionState.loading = false;

	refreshData();
}

/**
 * Updates all that is needed on the inputs for the liquidity.
 * @param isInput whether the input to update is the input token for the liquidity
 */
export async function updateInputs(isInput: boolean = isLastModifiedInput) {
	connectionState.loading = true;
	clearTimeout(nextUpdate);

	await updateValues(isInput);

	connectionState.loading = false;
	refreshData();
}

export async function refreshData() {
	connectionState.loading = true;
	clearTimeout(nextUpdate);

	if (!connectionState.connection) return;
	if (swapData.pair2) return;

	if (swapData.token1) {
		swapData.token1 = await getTokenInfo(swapData.token1.asset);
		if (!swapData.token2 && !isCcy(swapData.token1.asset)) {
			await updateSwapInputs(false, await getTokenInfo(await getCcy()));
		}
	}
	if (swapData.token2) {
		swapData.token2 = await getTokenInfo(swapData.token2.asset);
		if (!swapData.token1 && !isCcy(swapData.token2.asset)) {
			await updateSwapInputs(true, await getTokenInfo(await getCcy()));
		}
	}

	if (swapData.pair1) {
		liquidityData.lpToken = await getLpTokenInfo(swapData.pair1);
	}
	await updateValues();

	connectionState.loading = false;
	requestUpdateInputs();
}

export async function addLiquidity(successCallback: (msg: string, link: string) => ()=>void) {
	connectionState.loading = true;
	const session = connectionState.session;
	if (!session) throw new SwapError('Connect before using the dapp');
	if (!swapData.pair1) throw new SwapError('Pair is not defined');
	if (swapData.pair2)
		throw new SwapError(
			'Cannot add liquidity to a double pair. Please split the amount in half and add the liquidity in two steps.'
		);

	const fromCcy = isCcy(swapData.token1!.asset);
	const liq1 = fromCcy ? liquidityData.input2 : liquidityData.input1;
	const liq2 = fromCcy ? liquidityData.input1 : liquidityData.input2;

	let sent = false;
	let killAlert = () => {};
	session.call(
		op(
			'add_liq',
			/* asset1: */ swapData.pair1.id,
			/* amount1: */ liq1.value,
			/* amount_ccy: */ liq2.value
		)
	).on('sent', (txRid) => {
		if (sent) return;
		sent = true;
		const link =
			'https://explorer.chromia.com/testnet/' +
			'FA289E086E3D6C3277336E270BADDF75035C1F049F242AB2CF61773D2822213D/transaction/' +
			getId(txRid);
		killAlert = successCallback("transaction sent, waiting for confirmation...", link);
	}).then(async (txWithReceipt) => {
		await refreshData();
		connectionState.loading = false;
		const txRid = txWithReceipt.receipt.transactionRid;
		const link =
			'https://explorer.chromia.com/testnet/' +
			'FA289E086E3D6C3277336E270BADDF75035C1F049F242AB2CF61773D2822213D/transaction/' +
			getId(txRid);
		killAlert()
		successCallback('Liquidity added!', link);
	});
}

export async function removeLiquidity(successCallback: (msg: string, link: string) => ()=>void) {
	connectionState.loading = true;
	const session = connectionState.session;
	if (!session) throw new SwapError('Connect before using the dapp');
	if (!swapData.pair1) throw new SwapError('Pair is not defined');
	if (swapData.pair2)
		throw new SwapError(
			'Cannot add liquidity to a double pair. Please split the amount in half and add the liquidity in two steps.'
		);

	const fromCcy = isCcy(swapData.token1!.asset);
	const liq1 = fromCcy ? liquidityData.input2 : liquidityData.input1;
	const liq2 = fromCcy ? liquidityData.input1 : liquidityData.input2;

	let sent = false;
	let killAlert = () => {};
	session.call(
		op(
			'remove_liq',
			/* asset1: */ swapData.pair1.id,
			/* amount1: */ liq1.value,
			/* amount_ccy: */ liq2.value
		)
	).on('sent', (txRid) => {
		if (sent) return;
		sent = true;
		const link =
			'https://explorer.chromia.com/testnet/' +
			'FA289E086E3D6C3277336E270BADDF75035C1F049F242AB2CF61773D2822213D/transaction/' +
			getId(txRid);
		killAlert = successCallback("transaction sent, waiting for confirmation...", link);
	}).then(async (txWithReceipt) => {
		await refreshData();
		connectionState.loading = false;
		const txRid = txWithReceipt.receipt.transactionRid;
		const link =
			'https://explorer.chromia.com/testnet/' +
			'FA289E086E3D6C3277336E270BADDF75035C1F049F242AB2CF61773D2822213D/transaction/' +
			getId(txRid);
		killAlert()
		successCallback('Liquidity removed!', link);
	});
}

export function requestUpdateInputs() {
	clearTimeout(nextUpdate);
	nextUpdate = setTimeout(refreshData, TWENTY_SECONDS);
}
