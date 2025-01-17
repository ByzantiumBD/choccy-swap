<script lang="ts">
	import { connectionState } from '$lib/states/shared/connection-state.svelte';
	import { getAllOrdersByPriceRange } from '$lib/interactions/queries';
	import { calcPrice, PRICE_PRECISION } from '$lib/interactions/swaps';
	import type { Pair, ReadablePriceType } from '$lib/types';
	import { createAmountFromBalance, type Amount } from '@chromia/ft4';
	import { onMount } from 'svelte';
	import OrderListEntry from './OrderListEntry.svelte';
	import { getPriceInCcy, makeStringValueReadablePrice } from '$lib/number-utils';

	type OrderInfo = {
		number: string;
		volume: Amount;
		symbol: string;
		priceRange: string;
		width: number;
		tooltip: TooltipData;
	};
	type TooltipData = {
		one: ReadablePriceType | undefined,
		two: ReadablePriceType | undefined,
	}
	type OrderInfoRaw = {
		number: number;
		volume: bigint;
		priceRange: string;
	};
	type Range = {
		start: bigint;
		end: bigint | undefined;
	};

	const rangesPercent: Range[] = [
		{ start: 0n, end: 10n },
		{ start: 10n, end: 20n },
		{ start: 20n, end: 30n },
		{ start: 30n, end: 40n },
		{ start: 40n, end: 50n },
		{ start: 50n, end: undefined }
	];

	let { sell = false, pair }: { sell?: boolean; pair: Pair | undefined } = $props();
	let orders: OrderInfo[] = $state([]);
	let loading: boolean = $state(true);
	let updater: NodeJS.Timeout | undefined = $state(undefined);

	async function getOrders() {
		if (!pair) return;
		await Promise.all(rangesPercent.map((range, index) => getOrdersInRange(pair, range, index)));
		setOrderWidths();
	}

	function setOrderWidths() {
		const tot = orders.reduce<bigint>((tot: bigint, o: OrderInfo | undefined) => {
			return tot + (o?.volume.value ?? 0n);
		}, 0n);
		if (tot === 0n) return;
		orders.forEach((o, i) => {
			if (!o) return;
			const width = (100 * Number(o.volume.value)) / Number(tot);
			orders[i].width = width;
		});
	}

	function calcTooltip(percentStart: bigint, percentEnd: bigint | undefined):
	TooltipData {
		const numberPrice = getPriceInCcy(pair)
		const startPrice = (numberPrice * Number(percentStart)) / 100;
		let endPrice = percentEnd !== undefined
			? (numberPrice * Number(percentEnd)) / 100
			: undefined;

		if (sell) {
			return {
				one: makeStringValueReadablePrice(startPrice.toString()),
				two: endPrice === undefined
					? undefined
					: makeStringValueReadablePrice(endPrice.toString()),
			}
		} else {
			return {
				one: endPrice === undefined
					? undefined
					: makeStringValueReadablePrice(endPrice.toString()),
				two: makeStringValueReadablePrice(startPrice.toString()),
			}
		}
	}

	async function getOrdersInRange(pair: Pair, range: Range, idx: number) {
		if (!connectionState.connection) return;

		const currPrice = calcPrice(pair.amount1, pair.amountCcy);
		let endPrice = 0n;
		let startPrice = 0n;

		const percentStart = sell ? 100n + range.start : 100n - range.start;
		const percentEnd = range.end === undefined
			? undefined
			: (sell ? 100n + range.end : 100n - range.end);
		
		startPrice = (currPrice * percentStart) / 100n;
		if (percentEnd === undefined) {
			endPrice = sell ? PRICE_PRECISION * PRICE_PRECISION : 0n;
		} else {
			endPrice = (currPrice * percentEnd) / 100n;
		}

		const one = sell ? startPrice : endPrice;
		const two = sell ? endPrice : startPrice;

		let paginator = await getAllOrdersByPriceRange(pair.asset1, one, two);

		let info: OrderInfoRaw = {
			number: 0,
			volume: 0n,
			priceRange: (sell ? '+' : '-') + range.end + '%'
		};

		if (range.end === undefined) {
			info.priceRange = (sell ? '>' : '<') + range.start + '%';
		}

		let finished = false;

		while (!finished) {
			paginator.data.map((o) => {
				info.number += 1;
				info.volume += o.amount.value;
			});
			if (paginator.hasMore) {
				paginator = await paginator.loadMore();
			} else {
				finished = true;
			}

			const expected = sell ? pair.ccy : pair.asset1;

			orders[idx] = {
				number: '' + info.number,
				volume: createAmountFromBalance(info.volume, expected.decimals),
				symbol: ' ' + expected.symbol,
				priceRange: info.priceRange,
				width: orders[idx]?.width ?? 0,
				tooltip: calcTooltip(percentStart, percentEnd)
			};
		}
	}

	async function updateOrders() {
		loading = true;
		await getOrders();
		loading = false;
		if (!pair) {
			updater = setTimeout(updateOrders, 2000);
		} else {
			updater = setTimeout(updateOrders, 20000);
		}
	}

	onMount(() => {
		updateOrders();
		return () => clearTimeout(updater);
	});
</script>

<div class="flex flex-col grow {sell ? 'border-r' : ''} border-[#fff5]">
	<h3
		class="bg-[#0008] title {sell
			? 'sell'
			: ''} p-3 text-2xl font-bold allcenter underline decoration-2"
	>
		{sell ? 'Selling' : 'Buying'} Orders
	</h3>
	<div
		class="flex {sell
			? ''
			: 'flex-row-reverse'} items-center justify-around opacity-50 text-lg py-2"
	>
		<span class="O">Number of Orders</span>
		<span>Volume</span>
		<span>Price Range</span>
	</div>
	<hr class="border-gray-600 border-1" />
	{#each orders as order}
		<OrderListEntry {order} {sell} {loading} />
	{:else}
		{#each { length: 6 }}
			<OrderListEntry order={undefined} {sell} loading />
		{/each}
	{/each}
</div>

<style>
	span {
		flex-grow: 1;
		flex-basis: 1px;
		text-align: center;
	}
	.title {
		border-radius: 0 1.5rem 0 0;
		text-decoration-color: #ed32bf;
		&.sell {
			border-radius: 1.5rem 0 0 0;
			text-decoration-color: #8eeafc;
		}
	}

	@media (max-width: 460px) {
		.title {
			font-size: large !important;
		}
	}
</style>
