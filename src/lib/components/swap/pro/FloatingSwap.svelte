<script lang="ts">
	import ReadablePrice from '$lib/components/common/readablePrice.svelte';
	import { makeStringValueReadablePrice, numToString } from '$lib/number-utils';
	import { connectionState } from '$lib/states/shared/connection-state.svelte';
	import { swap } from '$lib/states/swap/swap-state-interactions.svelte';
	import { swapData } from '$lib/states/swap/swap-states.svelte';
	import Walletconnector from '../common/walletconnector.svelte';
	import ProInputs from './ProInputs.svelte';
	import ProSettings from './ProSettings.svelte';

	let { success }: { success: (msg: string, link: string) => ()=>void } = $props();

	let canSwap: boolean = $derived.by(() => {
		if (!swapData.token1 || !swapData.token2) return false;
		if (swapData.input1.value > swapData.token1.amountOwned.value) return false;
		if (swapData.input1.value <= 0n) return false;
		return true;
	});

	async function onclick() {
		await swap(success);
	}
</script>

<div class="widecenter max-[900px]:flex-col">
	<div class="mt-11 flex-1 widecenter flex-col">
		<ProInputs isInput />
		<ProInputs />
		<div class="mb-5">
			<ProSettings />
		</div>
	</div>

	<div class="flex-1 widecenter flex-col">
		<div class="my-3 mx-6 flex-col">
			<div class="text-sm text-[#fff8] flex">
				{#if swapData.token1 && swapData.token2}
					<span>Swap</span>
					<ReadablePrice
						fontSize={0.875}
						class="mx-0.5"
						{...makeStringValueReadablePrice(swapData.input1.toString())}
					/>
					<span>{swapData.token1?.asset.symbol} for</span>
					<ReadablePrice
						fontSize={0.875}
						class="mx-0.5"
						{...makeStringValueReadablePrice(swapData.input2.toString())}
					/>
					<span>{swapData.token2.asset.symbol}</span>
					<span class="ml-auto">Price Impact: {numToString(swapData.impact).slice(0, 4)}%</span>
				{:else}
					<span>Choose tokens</span>
				{/if}
			</div>
			<div class="text-sm text-[#fff8] flex justify-between mt-2">
				<span>Slippage: {swapData.settings.slippage}%</span>
				<span>Deadline: {swapData.settings.deadline} minutes</span>
			</div>
		</div>
		<div class="flex justify-center mt-auto mb-6 mx-3 text-[#1a1a1a]">
			{#if !connectionState.session}
				<Walletconnector />
			{:else}
				<button disabled={!canSwap} {onclick} class="clickable gradientbutton p-3 rounded-3xl grow">
					Swap
				</button>
			{/if}
		</div>
	</div>
</div>

<style>
	.gradientbutton {
		background: linear-gradient(to right, #ff02d1 0, #8eeafc 100%);
		&:disabled {
			background: linear-gradient(to right, #fff1 0, #fff2 100%);
			color: #fff8;
		}
	}
</style>
