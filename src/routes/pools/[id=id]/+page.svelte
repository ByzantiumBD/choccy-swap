<script lang="ts">
	import PoolStats from '$lib/components/pools/PoolStats.svelte';
	import type { PageData } from './$types';
	import type { Pair } from '$lib/types';
	import { getPairInfo } from '$lib/interactions/swaps';
	import OrderList from '$lib/components/pools/OrderList.svelte';
	import { onDestroy, onMount } from 'svelte';
	import {
		loadAllOrders,
		splitAllOrdersInSteps,
		TWENTY_SECONDS
	} from '$lib/states/shared/order-state-interactions.svelte';
	import type { OrderInfo } from '$lib/states/shared/types';
	import { allOrders } from '$lib/states/shared/order-states.svelte';
	import { getId } from '$lib/utils';

	let { data }: { data: PageData } = $props();
	let id = $derived(getId(data.id ?? ""))
	let destroyer: () => void = $state(() => {})
	let loading = $state(true);

	let pair: Pair | undefined = $state(undefined);
	let orders: { buy: OrderInfo[]; sell: OrderInfo[] } | undefined = $derived.by(() => {
		if (!pair) return undefined;
		const os = splitAllOrdersInSteps(pair, [100, 200, 300, 400, 500]);
		return os;
	});

	async function load() {
		loading = true;
		await loadAllOrders(data.id);
		loading = false;
	}

	onMount(() => {
		getPairInfo(data.id).then((p) => {
			pair = p;
			load().then(() => {
				const updater = setInterval(load, TWENTY_SECONDS);
				allOrders[id].updater = updater;
				destroyer = () => clearInterval(updater)
			});
		});
	});
	onDestroy(() => destroyer());
</script>

<div class="first flex items-stretch basis-1 mt-24 self-stretch px-3 text-white">
	<div class="chart grow-[2] basis-1 mx-2 allcenter rounded-3xl">Chart not yet available</div>

	<div class="statsholder flex flex-col grow basis-1 mx-2 items-stretch">
		<PoolStats id={data.id} />
		<a
			href="/swap?in={data.id}"
			class="bgblur p-5 bg-[#ed32bf88] border-2 border-[#ed32bf] text-white font-bold text-xl allcenter clickable self-stretch my-5 rounded-3xl"
		>
			Open on Swap Page
		</a>
	</div>
</div>

<div class="second text-white flex flex-col items-stretch grow basis-1 self-stretch px-3">
	<h1 class="font-bold allcenter text-4xl my-3">Orderbook</h1>
	<div class="flex items-stretch bg-[#101010a0] rounded-3xl overflow-hidden bgblur mb-5">
		<OrderList {loading} orders={orders?.sell ?? []} sell />
		<OrderList {loading} orders={orders?.buy ?? []} />
	</div>
</div>

<style lang="less">
	.bgblur {
		backdrop-filter: blur(15px);
	}
	.chart {
		background-image: radial-gradient(#30303080, #1a1a1a80);
		backdrop-filter: blur(15px);
		margin-bottom: 1rem;
	}
	@media (max-width: 960px) {
		.first {
			flex-direction: column;
			& > .chart {
				flex-basis: 200px;
			}
			& > .statsholder {
				align-self: center;
				min-width: 300px;
			}
		}
	}
</style>
