<script lang="ts">
	import { makeNumberReadable, removeTrailingZeros } from '$lib/number-utils';
	import { swapData } from '$lib/states/swap/swap-states.svelte';
	import { createAmount } from '@chromia/ft4';
    import { ensureInputIsDecimalNumber } from '$lib/number-utils';
    import { orderData } from '$lib/states/swap/swap-states.svelte';

	let textIn = $state(orderData.input1.toString());

	let balance = $derived(
		swapData.token1?.amountOwned ?? createAmount(0, swapData.token1?.asset.decimals ?? 18)
	);

	function oninput(e: Event & { currentTarget: HTMLInputElement }) {
		const value = ensureInputIsDecimalNumber(e.currentTarget.value, swapData.token1?.asset.decimals ?? 18);
		const amount = createAmount(value, swapData.token1?.asset.decimals ?? 18);
		orderData.input1 = amount;
		if (value !== removeTrailingZeros(textIn)) {
			textIn = value;
		}
	}
</script>

<div class="bg-[#ed32bf55] border-2 border-[#ed32bf88] rounded-2xl m-3 flex p-3">
	<div class="flex-[2_0_1px] flex flex-col">
		<span class="text-base">{swapData.token1?.asset.name ?? 'Select a token'}</span>
		<input {oninput} bind:value={textIn} placeholder="0.00" />
	</div>
	<div class="flex-[1_0_1px] flex flex-col items-end justify-center">
		<span class="text-base text-[#fff8]">Balance: {makeNumberReadable(balance.toString())}</span>
		<span class="text-base text-[#fff8]">{makeNumberReadable(balance.toString())}$</span>
	</div>
</div>

<style>
	input {
		all: unset;
		font-size: xx-large;
		width: 100%;
		&::placeholder {
			color: #fff8;
		}
	}
</style>
