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

<div class="widecenter">
	<div class="flex-1 flex items-stretch justify-start flex-col pb-[1rem]">
		<div class="ml-5 mt-3 text-2xl">{orderData.isBuy ? 'Buy' : 'Sell'}</div>
		<!-- Inputs -->

		<OrderAmountInput />
		<OrderPriceInput />

		<ProSettings isOrders />
	</div>

	<div class="flex-1 widecenter flex-col">
		<div class="flex justify-around mx-5 rounded bg-[#fff2] mt-5">
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

		<div class="my-3 mx-6 flex-col">
			<div class="text-sm text-[#fff8] flex justify-between">
				<span>
					Current Price: {swapData.pair1
						? stringPriceFromPair(swapData.pair1, orderData.inverted)
						: 'N/A'}
					{getPriceLabel()}
				</span>
				<span>
					Order Price: {stringFromGtvPrice(orderData.price, orderData.inverted, getDecimalsDiff(swapData.pair1))}
					{getPriceLabel()}
				</span>
			</div>
			{#if swapData.token1 && swapData.token2}
				<div class="flex mt-2 text-sm text-[#fff8]">
					<span class="mr-1">{orderData.isBuy ? 'Buy ' : 'Sell '}</span>
					<ReadablePrice fontSize={.875} {...makeStringValueReadablePrice(orderData.input1.toString())} />
					<span class="mx-1">{swapData.token1.asset.symbol} for</span>
					<ReadablePrice fontSize={.875} {...makeStringValueReadablePrice(getOtherSideOrder().toString())} />
					<span class="ml-1 mr-auto">{swapData.token2.asset.symbol}</span>
				</div>
			{/if}
			<div class="text-sm text-[#fff8]">
				<br/>
				<br/>
				order: 
				{shortenNumber(""+Number(orderData.price)/Number(PRICE_PRECISION)) + ' $/CCY'}
				<br/>
				current: 
				{shortenNumber(""+Number(swapData.pair1?.amount1 ?? 0)/Number(swapData.pair1?.amountCcy ?? 1)) + ' $/CCY'}
			</div>
		</div>
		<div class="flex justify-center mt-auto mb-6 mx-3 text-[#1a1a1a]">
			{#if !connectionState.session}
				<Walletconnector />
			{:else}
				<button {onclick} disabled={!canPlace} class="clickable gradientbutton p-3 rounded-3xl grow">
					Place Order
				</button>
			{/if}
		</div>
	</div>
</div>

<style>
	.liquidity_buttons {
		color: #fff8;
		font-size: large;
		flex: 1 0 1px;
		padding: 3px 0;
		&.selected {
			color: white;
			background-color: #ed32bf;
			border-radius: 0.25rem;
		}
	}
	.gradientbutton {
		background: linear-gradient(to right, #ff02d1 0, #8eeafc 100%);
		&:disabled {
			background: linear-gradient(to right, #fff1 0, #fff2 100%);
			color: #fff8;
		}
	}
</style>
