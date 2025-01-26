<script lang="ts">
	import type { OrderInfo } from '$lib/states/shared/types';
	import type { ReadablePriceType } from '$lib/types';
	import OrderProEntry from './OrderProEntry.svelte';
	const SECTION_NUMBER = 4;
	const EMPTY_READABLE: ReadablePriceType = { val: '...', numberOfDecimalZeros: 0 };
	const EMPTY: OrderInfo = {
		number: '...',
		volume: '...',
		symbol: '...',
		priceRange: '...',
		width: 0,
		tooltip: { one: EMPTY_READABLE, two: EMPTY_READABLE }
	};
	const NO_INFO = Array(SECTION_NUMBER).fill(EMPTY);

	type Props = {
		orders?: {
			sell: OrderInfo[];
			buy: OrderInfo[];
		};
		loading: boolean;
		invert?: boolean;
	};

	let { orders = { sell: NO_INFO, buy: NO_INFO }, invert = false, loading }: Props = $props();

	let sells: OrderInfo[] = $derived.by(() => {
		if (invert) {
			return orders.buy.map((o) => {
				return {
					...o,
					priceRange: o.priceRange.replace('-', '+').replace('<', '>')
				};
			});
		} else return orders.sell;
	});
	let buys: OrderInfo[] = $derived.by(() => {
		if (invert) {
			return orders.sell.map((o) => {
				return {
					...o,
					priceRange: o.priceRange.replace('+', '-').replace('>', '<')
				};
			});
		} else return orders.buy;
	});
</script>

<div class="flex justify-center items-stretch self-stretch mx-5 my-3 relative">
	<div class="chart sell">
		{#each buys as buy}
			<OrderProEntry order={buy} {loading} />
		{/each}
	</div>
	<span class="bar"></span>
	<div class="chart buy">
		{#each sells as sell}
			<OrderProEntry order={sell} sell {loading} />
		{/each}
	</div>
</div>

<style lang="less">
	.chart {
		flex: 1 0 1px;
		display: flex;
		border-bottom: solid 1px #fff8;
		&.sell {
			flex-direction: row-reverse;
		}
	}
	.bar {
		position: absolute;
		bottom: 0;
		left: 50%;
		width: 1px;
		height: 10px;
		background-color: #fff8;
	}
</style>
