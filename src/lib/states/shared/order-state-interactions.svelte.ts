import { getAllOrdersByPriceRange } from '$lib/interactions/queries';
import { calcPrice, PRICE_PRECISION } from '$lib/interactions/swaps';
import type { BufferId } from 'postchain-client';
import { allOrders } from './order-states.svelte';
import { getId } from '$lib/utils';
import type { OrderInfo, OrderInfoSection, PerthouPriceRange, TooltipData } from './types';
import type { Pair } from '$lib/types';
import { makeNumberReadable, makeStringValueReadablePrice, numToString } from '$lib/number-utils';
import { createAmountFromBalance } from '@chromia/ft4';

export const MAX_PRICE = PRICE_PRECISION * PRICE_PRECISION;
export const TWENTY_SECONDS = 20000;

/**
 * loads all orders into `allOrders`. Does not remove the timeout for updating.
 * @param pairId id of the pair (or asset) to retrieve from
 */
export async function loadAllOrders(pairId: BufferId) {
	const id = getId(pairId);
    allOrders[id] = { orders: [], updater: undefined };

	let paginator = await getAllOrdersByPriceRange(pairId, 0n, MAX_PRICE);

	let finished = false;
	while (!finished) {
		allOrders[id].orders = allOrders[id].orders.concat(paginator.data);
		if (paginator.hasMore) {
			paginator = await paginator.loadMore();
		} else {
			finished = true;
		}
	}
}

/**
 * splits all orders into sections based on prices
 * @param id the id of the pair. If missing, it will not be loaded.
 * @param stepsPerThou must be all integers between.
 */
export function splitAllOrdersInSteps(pair: Pair, stepsPerThou: number[]) {
	const rangesPerThou: PerthouPriceRange[] = [];
	let previousStep = 0n;
	stepsPerThou.forEach(step => {
		rangesPerThou.push({ start: previousStep, end: BigInt(step) })
		previousStep = BigInt(step)
	});
	rangesPerThou.push({ start: previousStep, end: undefined })
	const inverseCurrentPrice = calcPrice(pair.amount1, pair.amountCcy);

	const buyInfos = rangesPerThou.map(
		(r) => createOrderInfoSection(r, inverseCurrentPrice, false)
	);
	const sellInfos = rangesPerThou.map(
		(r) => createOrderInfoSection(r, inverseCurrentPrice, true)
	);

	// prices go up in here, cause inverse
	const buyThresholds = buyInfos.map((i) => i.endPrice);
	// prices go down in here, cause inverse
	const sellThresholds = sellInfos.map((i) => i.startPrice);

	const orderInfo = allOrders[getId(pair.id)];
	if (orderInfo === undefined) return undefined;
	const orders = allOrders[getId(pair.id)].orders;

	orders.map((o) => {
		const ts = o.buyCcy? sellThresholds : buyThresholds
		console.log(ts)
		const idx = ts.findIndex((t) => (o.buyCcy ? o.price >= t : o.price <= t));

		if(ts[idx] === undefined) {
			console.error("rounding errors in order splitting - ", idx);
			return;
		}

		const tvl = o.buyCcy ? o.amount.value : (o.amount.value * o.price) / PRICE_PRECISION;

		(o.buyCcy? sellInfos : buyInfos)[idx].number += 1;
		(o.buyCcy? sellInfos : buyInfos)[idx].volume += tvl;
	});

	const buyTvl = calcTvl(buyInfos)
	const sellTvl = calcTvl(sellInfos)

	function calcWidth(volume: bigint, tvl: bigint) {
		if (tvl === 0n) return 0;
		return Number(volume * 100n / tvl)
	}

	const buys: OrderInfo[] = buyInfos.map(i => {
		return {
			number: makeNumberReadable(numToString(i.number)),
			volume: makeNumberReadable(
				createAmountFromBalance(i.volume, pair.asset1.decimals).toString()
			),
			symbol: pair.asset1.symbol,
			priceRange: i.priceRange,
			width: calcWidth(i.volume, buyTvl),
			tooltip: calcTooltip(i, pair.asset1.decimals, pair.ccy.decimals),
		}
	})
	const sells: OrderInfo[] = sellInfos.map(i => {
		return {
			number: makeNumberReadable(numToString(i.number)),
			volume: makeNumberReadable(
				createAmountFromBalance(i.volume, pair.asset1.decimals).toString()
			),
			symbol: pair.asset1.symbol,
			priceRange: i.priceRange,
			width: calcWidth(i.volume, sellTvl),
			tooltip: calcTooltip(i, pair.asset1.decimals, pair.ccy.decimals),
		}
	})
	
	return {
		sell: sells,
		buy: buys,
	}
}


function createOrderInfoSection(range: PerthouPriceRange, currentPrice: bigint, sell: boolean) {
	let endPrice = 0n;
	let startPrice = 0n;

	// sell orders happen at lower prices, since price is in CCY
	const percentStart = sell ? 1000n - range.start : 1000n + range.start;
	const percentEnd =
		range.end === undefined ? undefined : sell ? 1000n - range.end : 1000n + range.end;

	startPrice = (currentPrice * percentStart) / 1000n;
	if (percentEnd === undefined) {
		endPrice = sell ? 0n : MAX_PRICE;
	} else {
		endPrice = (currentPrice * percentEnd) / 1000n;
	}

	const low = sell ? endPrice : startPrice;
	const high = sell ? startPrice : endPrice;

	const info: OrderInfoSection = {
		number: 0,
		volume: 0n,
		priceRange: (sell ? '+' : '-') + Number(range.end)/10 + '%',
		startPrice: low,
		endPrice: high,
	};

	if (range.end === undefined) {
		info.priceRange = (sell ? '>' : '<') + Number(range.start)/10 + '%';
	}

	return info;
}


function calcTvl(os: OrderInfoSection[]): bigint {
	return os.reduce<bigint>((tot: bigint, o: OrderInfoSection) => {
		return tot + (o?.volume ?? 0n);
	}, 0n);
}

function calcTooltip(o: OrderInfoSection, assetDecimals: number, ccyDecimals: number): TooltipData {
	const decimalsCorrection = 10 ** (ccyDecimals - assetDecimals);
	const startPricePerCcy = (Number(o.startPrice) / Number(PRICE_PRECISION)) * decimalsCorrection;
	const endPricePerCcy = Number(o.endPrice) / Number(PRICE_PRECISION) * decimalsCorrection;
	const startPrice = 1 / startPricePerCcy;
	let endPrice = 1 / endPricePerCcy;
	if (o.endPrice === PRICE_PRECISION * PRICE_PRECISION) {
		endPrice = 0;
	}

	const two =
		startPrice === Infinity
			? { val: '∞', numberOfDecimalZeros: 0 }
			: makeStringValueReadablePrice(numToString(startPrice));
	const one = makeStringValueReadablePrice(numToString(endPrice));

	return {
		one,
		two
	};
}