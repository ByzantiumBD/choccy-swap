<script lang="ts">
	import ReadablePrice from '$lib/components/common/readablePrice.svelte';
	import { calcLpTokensFromAmountInOrOut } from '$lib/interactions/liquidity';
	import { makeNumberReadable, makeStringValueReadablePrice } from '$lib/number-utils';
	import { connectionState } from '$lib/states/shared/connection-state.svelte';
	import {
		addLiquidity,
		removeLiquidity
	} from '$lib/states/swap/liquidity-state-interactions.svelte';
	import { liquidityData, swapData } from '$lib/states/swap/swap-states.svelte';
	import { isCcy } from '$lib/utils';
	import Walletconnector from '../common/walletconnector.svelte';
	import ProInputs from './ProInputs.svelte';

	let { success }: { success: (msg: string, link: string) => () => void } = $props();

	let isAdd = $state(true);

	let canAdd = $derived.by(() => {
		if (!swapData.pair1 || !swapData.token1 || !swapData.token2) return false;
		const nonZero = liquidityData.input1.value > 0n && liquidityData.input2.value > 0n;
		let hasBalance = false;
		if (isAdd) {
			const hasBalance1 = (swapData.token1?.amountOwned.value ?? 0n) >= liquidityData.input1.value;
			const hasBalance2 = (swapData.token2?.amountOwned.value ?? 0n) >= liquidityData.input2.value;
			hasBalance = hasBalance1 && hasBalance2;
		} else {
			const lpRequired = calcLpTokensFromAmountInOrOut(
				liquidityData.input1.value,
				swapData.pair1,
				isCcy(swapData.token1?.asset)
			);
			hasBalance = (liquidityData.lpToken?.amountOwned.value ?? 0n) >= lpRequired;
		}
		return nonZero && hasBalance;
	});

	async function onclick() {
		if (!canAdd) return;
		if (isAdd) {
			await addLiquidity(success);
		} else {
			await removeLiquidity(success);
		}
	}
</script>

<div class="widecenter max-[900px]:flex-col">
	<div class="flex-1 flex items-stretch justify-start flex-col my-5">
		<ProInputs addLiquidity={isAdd} liquidity isInput />
		<ProInputs addLiquidity={isAdd} liquidity />
	</div>

	<div class="flex-1 widecenter flex-col">
		<div class="flex justify-around mx-5 rounded bg-[#fff2] mt-5">
			<button class="liquidity_buttons {isAdd ? 'selected' : ''}" onclick={() => (isAdd = true)}>
				Add
			</button>
			<button class="liquidity_buttons {isAdd ? '' : 'selected'}" onclick={() => (isAdd = false)}>
				Remove
			</button>
		</div>
		<div
			class="flex flex-col mt-5 mx-6 text-lg font-medium text-white border border-[var(--border)] rounded-3xl p-6"
		>
			<div class="flex items-center">
			<span class="mr-1">{isAdd ? 'Add ' : 'Remove '}</span>
			<ReadablePrice
				fontSize={1.125}
				{...makeStringValueReadablePrice(liquidityData.input1.toString())}
			/>
			<span class="mx-1">{swapData.token1?.asset.symbol} and</span>
			<ReadablePrice
				fontSize={1.125}
				{...makeStringValueReadablePrice(liquidityData.input2.toString())}
				/>
				<span class="ml-1 mr-auto">{swapData.token2?.asset.symbol}</span>
			</div>
			<span class="mt-2 text-lg font-medium">Liquidity Share: {makeNumberReadable('' + liquidityData.share * 100)}%</span>
		</div>

		<div class="flex justify-center my-6 mx-3 text-white">
			{#if !connectionState.session}
				<Walletconnector />
			{:else}
				<button {onclick} disabled={!canAdd} class="clickable gradientbutton p-3 rounded-3xl grow">
					{isAdd ? 'Add' : 'Remove'} Liquidity
				</button>
			{/if}
		</div>
	</div>
</div>

<style>
	.liquidity_buttons {
		color: var(--transparent);
		font-size: large;
		flex: 1 0 1px;
		padding: 4px 3px;
		&.selected {
			color: white;
			padding: 4px 3px;
			background-color: var(--mulberry);
			border-radius: 0.25rem;
		}
	}
	.gradientbutton {
		background: linear-gradient(to right, var(--mulberry) 0, var(--blue) 100%);
		&:disabled {
			background: linear-gradient(to right, #fff1 0, #fff2 100%);
			color: var(--transparent);
		}
	}
</style>
