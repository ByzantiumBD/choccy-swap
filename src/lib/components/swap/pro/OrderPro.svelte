<script lang="ts">
	import Tokenimg from "$lib/components/common/tokenimg.svelte";
	import { loadAllOrders, splitAllOrdersInSteps, TWENTY_SECONDS } from "$lib/states/shared/order-state-interactions.svelte";
	import type { OrderInfo } from "$lib/states/shared/types";
	import { swapData } from "$lib/states/swap/swap-states.svelte";
	import { onMount } from "svelte";
	import OrderProChart from "./OrderProChart.svelte";

	let loading = $state(true);

	let orders1: { buy: OrderInfo[]; sell: OrderInfo[] } | undefined = $derived.by(() => {
		if (!swapData.pair1) return undefined;
		return splitAllOrdersInSteps(swapData.pair1, [100, 250, 500]);
	});
	let orders2: { buy: OrderInfo[]; sell: OrderInfo[] } | undefined = $derived.by(() => {
		if (!swapData.pair2) return undefined;
		return splitAllOrdersInSteps(swapData.pair2, [100, 250, 500]);
	});

	async function load() {
		if (!swapData.pair1) return;
		loading = true;
		await loadAllOrders(swapData.pair1.id);
		if (swapData.pair2) await loadAllOrders(swapData.pair2.id);
		loading = false;
	}

	onMount(() => {
		const i = setInterval(load, TWENTY_SECONDS);
		return () => clearInterval(i)
	});
</script>

<div class="rounded-3xl grow flex flex-col bg-[#10101099] boxblur">
	<h2 class="px-5 py-3 text-2xl font-bold bg-black rounded-t-3xl">OrderBook</h2>
	<div class="allcenter flex-col text-xl">
		<div class="allcenter m-5 self-stretch">
			<h3 class="text-xl font-extrabold mr-auto">Route</h3>
			<Tokenimg class="w-[50px]" src={swapData.token1?.asset.iconUrl ?? ""} />
			{#if swapData.pair2}
				<span class="mx-3">&gt;</span>
				<Tokenimg class="w-[50px]"  src={swapData.pair2.ccy.iconUrl ?? ""} />
			{/if}
			<span class="mx-3">&gt;</span>
			<Tokenimg class="w-[50px]"  src={swapData.token2?.asset.iconUrl ?? ""} />
		</div>
		<div class="allcenter flex-col mt-auto self-stretch">
			<OrderProChart orders={orders1} pair={swapData.pair1} {loading}/>

			{#if swapData.pair2}
				<OrderProChart orders={orders2} pair={swapData.pair2} {loading}/>
			{/if}
		</div>
	</div>
</div>

<style>
	.boxblur {
		backdrop-filter: blur(15px);
	}
</style>
