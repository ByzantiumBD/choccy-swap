import { calcPrice, PRICE_PRECISION } from '$lib/interactions/swaps';
import { makeStringValueReadablePrice, numToString, removeTrailingZeros, shortenNumber } from '$lib/number-utils';
import { orderData } from './swap-states.svelte';
import { getId, isCcy } from '$lib/utils';
import { swapData } from './swap-states.svelte';
import type { Pair } from '$lib/types';
import { createAmountFromBalance, op } from '@chromia/ft4';
import { connectionState } from '../shared/connection-state.svelte';
import { SwapError } from '$lib/errors';

const MILLIS_PER_DAY = 24 * 60 * 60 * 1000;

export function getGtvPrice(price: number, inverted: boolean, decimalsDiff: number) {
	if (price === 0) return 0n;
	const correctPrice = inverted ? 1 / price : price;
	return BigInt(correctPrice * Number(PRICE_PRECISION) * 10 ** decimalsDiff);
}

/**
 * Converts a price from gtv to a number
 * @param price - The price in gtv
 * @param inverted - Whether the price is inverted
 * @param decimalsDiff - The difference in decimals between the asset and ccy
 * @returns The price in the correct format
 */
export function fromGtvPrice(price: bigint, inverted: boolean, decimalsDiff: number) {
	const numPrice = Number(price) / (Number(PRICE_PRECISION) * (10 ** decimalsDiff));
	return inverted ? 1 / numPrice : numPrice;
}

export function stringFromGtvPrice(price: bigint, inverted: boolean, decimalsDiff: number) {
	const numPrice = fromGtvPrice(price, inverted, decimalsDiff);
	return removeTrailingZeros(shortenNumber(numPrice.toString()));
}

export function stringPriceFromPair(pair: Pair, inverted: boolean) {
	const priceCcy = fromGtvPrice(
		calcPrice(pair.amount1, pair.amountCcy),
		inverted,
		getDecimalsDiff(pair)
	);
	return removeTrailingZeros(shortenNumber(priceCcy.toString()));
}

export function readablePriceFromPair(pair: Pair, inverted: boolean) {
	const priceCcy = fromGtvPrice(
		calcPrice(pair.amount1, pair.amountCcy),
		inverted,
		getDecimalsDiff(pair)
	);
	return makeStringValueReadablePrice(numToString(priceCcy));
}

/**
 * returns true if the price should go up after the order executes.
 * In other words, returns true if the order must be placed at a lower price than the current price.
 */
export function wouldGoUp() {
    // If any of these three conditions changes, the value should change, because:

    // a sell is opposite of a buy
    const isBuy = orderData.isBuy;
    // a ccy order is opposite of a <other token> order
    const isCcyAsset = isCcy(swapData.token1!.asset);
    // price of ccy goes up if price of <other token> goes down
    const priceOfCcy = !orderData.inverted;

    // with all false, it should be true
    return isBuy !== isCcyAsset !== priceOfCcy;
}

export function isPriceValid() {
	if (!swapData.token1 || !swapData.pair1) return true;

    // orderData.price is always <token>/CCY
    // currentPrice too
	const currentPrice = calcPrice(swapData.pair1.amount1, swapData.pair1.amountCcy);

    const orderIncreasesPrice = orderData.isBuy === isCcy(swapData.token1.asset);
    
	return orderIncreasesPrice ? orderData.price < currentPrice : orderData.price > currentPrice;
}

export function getPriceLabel() {
	if (!swapData.pair1) return '';
	return orderData.inverted
		? 'CCY/' + swapData.pair1.asset1.symbol
		: swapData.pair1.asset1.symbol + '/CCY';
}

export function getDecimalsDiff(pair: Pair | undefined): number {
	if (!pair) return 0;
	return pair.asset1.decimals - pair.ccy.decimals;
}

export function getOtherSideOrder() {
	if (!swapData.token1 || !swapData.token2) return createAmountFromBalance(0n, 18);
	if (orderData.price === 0n) return createAmountFromBalance(0n, swapData.token2.asset.decimals);
	const isCcyIn = isCcy(swapData.token1.asset);
	const amount = orderData.input1.value;

	if (isCcyIn) {
		const value = (amount * orderData.price) / PRICE_PRECISION;
		return createAmountFromBalance(value, swapData.token2.asset.decimals);
	} else {
		const value = (amount * PRICE_PRECISION) / orderData.price;
		return createAmountFromBalance(value, swapData.token2.asset.decimals);
	}
}

export async function placeOrder(successCallback: (msg: string, link: string) => () => void) {
	connectionState.loading = true;
	const session = connectionState.session;
	if (!session) throw new SwapError('Connect before using the dapp');
	if (!swapData.pair1) throw new SwapError('Pair is not defined');
	if (swapData.pair2) throw new SwapError('Cannot place an order on a double pair.');

    const buyCcy = isCcy(swapData.token1!.asset) === orderData.isBuy;
    const needsConversion = orderData.isBuy;

    const amount = needsConversion ? getOtherSideOrder() : orderData.input1;
    const deadline = Date.now() + orderData.deadline * MILLIS_PER_DAY;

	let sent = false;
	let killAlert = () => {};
	session
		.call(
			op(
				"place_order",
                /* asset:   */ swapData.pair1.id,
                /* buy_ccy: */ buyCcy,
                /* amount:  */ amount.value,
                /* price:   */ orderData.price,
                /* deadline:*/ deadline,
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
			// await refreshData();
			connectionState.loading = false;
			const txRid = txWithReceipt.receipt.transactionRid;
			const link =
				'https://explorer.chromia.com/testnet/' +
				'FA289E086E3D6C3277336E270BADDF75035C1F049F242AB2CF61773D2822213D/transaction/' +
				getId(txRid);
			killAlert();
			successCallback('Order placed!', link);
		});
}
