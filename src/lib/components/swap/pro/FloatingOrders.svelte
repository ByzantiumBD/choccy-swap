<script lang="ts">
	import OrderAmountInput from './OrderAmountInput.svelte';

	import OrderPriceInput from './OrderPriceInput.svelte';
	import { connectionState } from '$lib/states/shared/connection-state.svelte';
	import { orderData, swapData } from '$lib/states/swap/swap-states.svelte';
	import Walletconnector from '../common/walletconnector.svelte';
	import {
		getDecimalsDiff,
		getOtherSideOrder,
		getPriceLabel,
		placeOrder,
		readablePriceFromPair,
		stringFromGtvPrice,
		stringPriceFromPair
	} from '$lib/states/swap/order-state-interactions.svelte';
	import ReadablePrice from '$lib/components/common/readablePrice.svelte';
	import { makeStringValueReadablePrice, shortenNumber } from '$lib/number-utils';
	import ProSettings from './ProSettings.svelte';
	import { PRICE_PRECISION } from '$lib/interactions/swaps';

	let { success }: { success: (msg: string, link: string) => () => void } = $props();

	let canPlace = $derived.by(() => {
		const singleHop = swapData.pair1 && !swapData.pair2;
		const nonZero = orderData.input1.value > 0n && orderData.price > 0n;
		const connected = connectionState.session;
		const hasBalance1 = (swapData.token1?.amountOwned.value ?? 0n) >= orderData.input1.value;

		return singleHop && nonZero && connected && hasBalance1;
	});

	function onclick() {
		if (!canPlace) return;
		placeOrder(success);
	}
</script>

<div class="widecenter max-[900px]:flex-col">
	<div class="flex-1 flex items-stretch justify-start flex-col pb-[1rem]">
		<div class="flex justify-around mx-5 rounded bg-[#fff2] mt-5 mb-3">
			<button
				class="liquidity_buttons {orderData.isBuy ? 'selected' : ''}"
				onclick={() => (orderData.isBuy = true)}
			>
				Buy
			</button>
			<button
				class="liquidity_buttons {orderData.isBuy ? '' : 'selected'}"
				onclick={() => (orderData.isBuy = false)}
			>
				Sell
			</button>
		</div>
		<!-- Inputs -->

		<OrderAmountInput />
		<OrderPriceInput />
	</div>

	<div class="flex-1 widecenter flex-col">
		<ProSettings isOrders />

		<div
			class="my-3 mx-6 flex flex-col border border-[var(--border)] rounded-3xl p-6 text-lg font-medium"
		>
			<span class="flex items-center">
				<span>Current Price: </span>
				<span class="ml-auto text-lg font-medium">
					{#if swapData.pair1}
						<ReadablePrice {...readablePriceFromPair(swapData.pair1, orderData.inverted)} />
					{:else}
						N/A
					{/if}
				</span>
				{getPriceLabel()}
			</span>

			<span class="flex items-center mt-2">
				<span>Order Price: </span>
				<span class="ml-auto text-lg font-medium flex">
					<ReadablePrice
						{...makeStringValueReadablePrice(
							stringFromGtvPrice(
								orderData.price,
								orderData.inverted,
								getDecimalsDiff(swapData.pair1)
							)
						)}
					/>
					{getPriceLabel()}
				</span>
			</span>

			{#if swapData.token1 && swapData.token2}
				<div class="flex mt-2 text-lg text-white">
					<span class="mr-1">{orderData.isBuy ? 'Buy ' : 'Sell '}</span>
					<ReadablePrice
						fontSize={1.125}
						{...makeStringValueReadablePrice(orderData.input1.toString())}
					/>
					<span class="mx-1">{swapData.token1.asset.symbol} for</span>
					<ReadablePrice
						fontSize={1.125}
						{...makeStringValueReadablePrice(getOtherSideOrder().toString())}
					/>
					<span class="ml-1 mr-auto">{swapData.token2.asset.symbol}</span>
				</div>
			{/if}
		</div>
		<div class="flex justify-center my-6 mx-5 text-white">
			{#if !connectionState.session}
				<Walletconnector />
			{:else}
				<button
					{onclick}
					disabled={!canPlace}
					class="clickable gradientbutton p-3 rounded-3xl grow"
				>
					Place Order
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
