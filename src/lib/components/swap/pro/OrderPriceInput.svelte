<script lang="ts">
	import { calcPrice } from '$lib/interactions/swaps';
	import { ensureInputIsDecimalNumber, removeTrailingZeros, shortenNumber } from '$lib/number-utils';
	import {
		getDecimalsDiff,
		getGtvPrice,
		getPriceLabel,
		isPriceValid,
		stringFromGtvPrice,
		wouldGoUp
	} from '$lib/states/swap/order-state-interactions.svelte';
	import { orderData, swapData } from '$lib/states/swap/swap-states.svelte';
	import { isCcy } from '$lib/utils';
	import { untrack } from 'svelte';

	let currentPrice = $derived(
		swapData.pair1 ? calcPrice(swapData.pair1.amount1, swapData.pair1.amountCcy) : 0n
	);

	let textPrice = $state('');

	function setPrice(percent: number) {
        // orderData.price is always <token>/CCY
		const factor = orderData.isBuy !== isCcy(swapData.token1!.asset) ? 100 + percent : 100 - percent;
		orderData.price = (currentPrice * BigInt(factor)) / 100n;
	}

	function oninput(e: Event & { currentTarget: HTMLInputElement }) {
		const value = ensureInputIsDecimalNumber(e.currentTarget.value, 100);
        e.currentTarget.value = value;
		const price = Number(value);
        if (!swapData.pair1) return;
		orderData.price = getGtvPrice(price, orderData.inverted, getDecimalsDiff(swapData.pair1));
	}

    function invertPrice() {
        orderData.inverted = !orderData.inverted;
		const value = ensureInputIsDecimalNumber(textPrice, 100);
        const price = Number(value);
        if (!swapData.pair1) return;
		orderData.price = getGtvPrice(price, orderData.inverted, getDecimalsDiff(swapData.pair1));
    }

	$effect(() => {
		const newPrice = orderData.price;
		if (newPrice === 0n) {
			textPrice = '0';
			return;
		}
        const expected = stringFromGtvPrice(
			newPrice,
			orderData.inverted,
			getDecimalsDiff(swapData.pair1)
		);
        const actualShortened = removeTrailingZeros(shortenNumber(untrack(() => textPrice)))
		if (expected !== actualShortened) {
			textPrice = expected;
		}
	});
</script>

<div class="{!isPriceValid() && 'invalid'} inputbox rounded-2xl m-3 flex p-3">
	<div class="flex-[2_0_1px] flex flex-col">
		<span class="text-base">{'Price'}</span>
		<input {oninput} bind:value={textPrice} placeholder="0.00" />
	</div>
	<div class="flex-[1_0_1px] flex flex-col">
		{#if swapData.token1 && swapData.token2}
			<div class="flex justify-end mb-1">
				<button class="text-sm text-[#fff8] mx-1" onclick={() => setPrice(5)}>
					{!wouldGoUp() ? '+5%' : '-5% '}
				</button>
				<button class="text-sm text-[#fff8] mx-1" onclick={() => setPrice(10)}>
					{!wouldGoUp() ? '+10%' : '-10% '}
				</button>
				<button class="text-sm text-[#fff8] mx-1" onclick={() => setPrice(25)}>
                    {!wouldGoUp() ? '+25%' : '-25% '}
				</button>
				<button class="text-sm text-[#fff8] mx-1" onclick={() => setPrice(50)}>
					{!wouldGoUp() ? '+50%' : '-50%'}
				</button>
			</div>
			<button
				class="flex flex-col items-end text-xl text-[#fff8] self-end"
				onclick={invertPrice}
			>
				<div>{getPriceLabel()}</div>
				<div class="text-xs text-[#fff8]">click to invert</div>
			</button>
		{/if}
	</div>
	<div class="warning">
		<div class="text-sm text-[#fff8]">
			{'Spot price is better than order price. Please adjust the order price.'}
		</div>
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
	.inputbox {
		position: relative;
		background-color: #ed32bf55;
		border: 2px solid #ed32bf88;
		& .warning {
			display: none;
			position: absolute;
			bottom: -2rem;
			right: 0;
			& div {
				color: #ed32ba;
			}
		}
		&.invalid {
			background-color: #ed328055;
			border-color: #ed328088;
			& .warning {
				display: block;
			}
		}
	}
</style>
