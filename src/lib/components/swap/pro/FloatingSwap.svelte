<script lang="ts">
	import ReadablePrice from '$lib/components/common/readablePrice.svelte';
	import { makeStringValueReadablePrice, numToString } from '$lib/number-utils';
	import { connectionState } from '$lib/states/shared/connection-state.svelte';
	import { swap } from '$lib/states/swap/swap-state-interactions.svelte';
	import { swapData } from '$lib/states/swap/swap-states.svelte';
	import Walletconnector from '../common/walletconnector.svelte';
	import ProInputs from './ProInputs.svelte';
	import ProSettings from './ProSettings.svelte';

	let { success }: { success: (msg: string, link: string) => () => void } = $props();

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
	<div class="my-4 flex-1 widecenter flex-col">
		<ProInputs isInput />
		<ProInputs />
	</div>

	<div class="flex-1 widecenter flex-col">
		<div class="my-3 mx-5 flex-col">
			<div class="mb-5">
				<ProSettings />
			</div>
			<div
				class="flex flex-col items-center mx-6 border-[1.5px] border-[var(--border)] rounded-3xl p-6"
			>
				{#if swapData.token1 && swapData.token2}
					<div class="flex items-center w-full">
						<span class="font-medium text-lg">Swap</span>
						<ReadablePrice
							fontSize={1.125}
							class="mx-1 font-light"
							{...makeStringValueReadablePrice(swapData.input1.toString())}
						/>
						<span class="font-medium text-lg">{swapData.token1?.asset.symbol} for</span>
						<ReadablePrice
							fontSize={1.125}
							class="mx-1 font-light"
							{...makeStringValueReadablePrice(swapData.input2.toString())}
						/>
						<span class="font-medium text-lg">{swapData.token2.asset.symbol}</span>
					</div>
					<span class="mr-auto font-medium text-lg mt-2">Price Impact: {numToString(swapData.impact).slice(0, 4)}%</span>
				{:else}
					<span>Choose tokens</span>
				{/if}
				<div class="text-sm text-white flex justify-between mt-2 mx-8 w-full">
					<span class="text-lg font-medium">Slippage: {swapData.settings.slippage}%</span>
					<span class="text-lg font-medium ml-auto">Deadline: {swapData.settings.deadline} minutes</span>
				</div>
			</div>
		</div>
		<div class="flex justify-center mt-3 mb-7 mx-8 text-white">
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
		background: linear-gradient(to right, var(--mulberry) 0, var(--blue) 100%);
		&:disabled {
			background: linear-gradient(to right, #fff1 0, #fff2 100%);
			color: #fff8;
		}
	}
</style>
