<script lang="ts">
	import Tokenimg from '$lib/components/common/tokenimg.svelte';
	import arrow from '$lib/images/common/arrowhoriz.svg';
	import {
		loadAllOrders,
		splitAllOrdersInSteps,
		TWENTY_SECONDS
	} from '$lib/states/shared/order-state-interactions.svelte';
	import type { OrderInfo } from '$lib/states/shared/types';
	import { swapData } from '$lib/states/swap/swap-states.svelte';
	import { onMount } from 'svelte';
	import OrderProChart from '../OrderProChart.svelte';
	import { isCcy } from '$lib/utils';

	let { isSwap }: { isSwap: boolean } = $props();

	let loading = $state(true);
	let asset1 = $derived(swapData.token1?.asset);
	let isAsset1Ccy = $derived((asset1 && isCcy(asset1)) ?? false);
	let asset2 = $derived.by(() => {
		const isAsset2Ccy = swapData.token2 && isCcy(swapData.token2.asset);
		if (isAsset1Ccy) return swapData.token2?.asset;
		if (!isAsset1Ccy && !isAsset2Ccy) return swapData.pair1?.ccy;
		return swapData.token2?.asset;
	});
	let asset3 = $derived.by(() => {
		const isAsset1Ccy = swapData.token1 && isCcy(swapData.token1?.asset);
		const isAsset2Ccy = swapData.token2 && isCcy(swapData.token2.asset);
		if (!isAsset1Ccy && !isAsset2Ccy) return swapData.token2?.asset;
		return undefined;
	});

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
		load();
		const i = setInterval(load, TWENTY_SECONDS);
		return () => clearInterval(i);
	});
</script>

<div class="rounded-3xl flex flex-col bg-[#10101088] boxblur">
	<h2 class="px-5 py-4 text-2xl font-bold bg-black rounded-t-3xl">OrderBook</h2>
	<div class="allcenter flex-col text-xl p-6">
		<div class="allcenter self-stretch mb-5">
			<h3 class="text-2xl font-extrabold mr-auto">Route</h3>
			<Tokenimg class="w-[40px]" src={asset1?.iconUrl ?? ''} />
			<img src={arrow} alt="switch" class="w-[35px]" />
			<Tokenimg class="w-[40px]" src={asset2?.iconUrl ?? ''} />
			{#if asset3}
				<img src={arrow} alt="switch" class="w-[35px]" />
				<Tokenimg class="w-[40px]" src={asset3?.iconUrl ?? ''} />
			{/if}
		</div>
		<div class="chartbox allcenter flex-col" style="margin-bottom:{(swapData.pair2? 0:180) + (isSwap? 30:0)}px;">
			<div class="flex items-center justify-start self-stretch mb-2">
				<h3 class="text-xl font-extrabold mr-3">Pair 1</h3>
				<Tokenimg class="w-[30px]" src={asset1?.iconUrl ?? ''} />
				<img src={arrow} alt="switch" class="w-[30px]" />
				<Tokenimg class="w-[30px]" src={asset2?.iconUrl ?? ''} />
			</div>
			<OrderProChart orders={orders1} {loading} invert={!isAsset1Ccy}/>
		</div>
		{#if !isSwap}
			<div class="text-sm text-[var(--transparent)] text-center mt-2">
				Orders and liquidity operations only work on single pair routes
			</div>
		{/if}

		{#if swapData.pair2}
			<div class="chartbox allcenter flex-col">
				<div class="flex items-center justify-start self-stretch">
					<h3 class="text-xl font-extrabold mr-3">Pair 2</h3>
					<Tokenimg class="w-[30px]" src={asset2?.iconUrl ?? ''} />
					<img src={arrow} alt="switch" class="w-[30px]" />
					<Tokenimg class="w-[30px]" src={asset3?.iconUrl ?? ''} />
				</div>
				<OrderProChart orders={orders2} {loading}/>
			</div>
		{/if}
	</div>
</div>

<style>
	.chartbox {
		border: solid 1px #fff8;
		border-radius: 1.5rem;
		padding: 1.5rem;
	}
</style>
