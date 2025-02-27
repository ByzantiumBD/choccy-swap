<script lang="ts">
	import Settings from '$lib/components/swap/normal/settings.svelte';
	import Swapinput from '$lib/components/swap/normal/swapinput.svelte';
	import cog from '$lib/images/swap/cog.svg';
	import switcharrow from '$lib/images/swap/switch.svg';
	import { makeStringValueReadablePrice } from '$lib/number-utils';
	import Walletconnector from '$lib/components/swap/common/walletconnector.svelte';
	import { connectionState } from '$lib/states/shared/connection-state.svelte';
	import { swapData } from '$lib/states/swap/swap-states.svelte';
	import { swap, switchTokens } from '$lib/states/swap/swap-state-interactions.svelte';
	import ReadablePrice from '$lib/components/common/readablePrice.svelte';

	let { success }: { success: (msg: string, link: string) => () => void } = $props();

	let isSettingsHidden = $state(true);

	let canSwap: boolean = $derived.by(() => {
		if (!swapData.token1 || !swapData.token2) return false;
		if (swapData.input1.value > swapData.token1.amountOwned.value) return false;
		if (swapData.input1.value <= 0n) return false;
		return true;
	});

	function closeSettings() {
		isSettingsHidden = true;
	}
	function openSettings() {
		isSettingsHidden = false;
	}

	async function swapClick() {
		await swap(success);
	}
</script>

<div
	class="allcenter flex-col min-w-[600px]:w-[600px] bg-[var(--dark-gray)] boxblur mx-2 rounded-3xl my-[3cm] text-white"
>
	<div class="allcenter !justify-between bg-black rounded-t-3xl w-full px-6 py-5">
		<h1 class="text-3xl font-extrabold">Swap</h1>
		<button onclick={openSettings} class="clickable w-[30px]">
			<img src={cog} alt="slippage menu" /></button
		>
	</div>

	<div class="allcenter flex-col w-full px-4 mt-4">
		<Swapinput isInput={true} />

		<div
			id="switch-background"
			class="absolute allcenter bg-[var(--dark-gray)] boxblur w-[2cm] h-[2cm] rounded-full border-[#c54b8c] border-2"
		>
			<button onclick={switchTokens} class="allcenter clickable w-[1.5cm] h-[1.5cm] rounded-full">
				<img src={switcharrow} alt="switch" />
			</button>
		</div>

		<Swapinput isInput={false} />
	</div>

	{#if swapData.token1 && swapData.token2}
		<div class="info flex items-stretch flex-col self-stretch mx-8 text-sm mt-2">
			<div class="flex justify-between max-[730px]:flex-col">
				<span class="flex">
					Swap
					<ReadablePrice
						class="mx-1"
						{...makeStringValueReadablePrice(swapData.input1.toString())}
					/>
					{swapData.token1?.asset.symbol}
					for
					<ReadablePrice
						class="mx-1"
						{...makeStringValueReadablePrice(swapData.input2.toString())}
					/>
					{swapData.token2?.asset.symbol}
				</span>
				<span class={swapData.impact > 10 ? 'danger' : ''}>Price Impact: {swapData.impact}%</span>
			</div>
			<div class="flex justify-between max-[730px]:flex-col">
				<span>Slippage: {swapData.settings.slippage}%</span>
				<span>Deadline: {swapData.settings.deadline} minutes</span>
			</div>
		</div>
	{/if}

	<div class="flex items-stretch justify-stretch w-full p-4 mt-3">
		{#if connectionState.session}
			<button
				onclick={swapClick}
				disabled={!canSwap}
				class="swapbutton grow clickable p-3 rounded-full text-xl font-extrabold gradientbutton"
			>
				Swap
			</button>
		{:else}
			<Walletconnector style="padding:0.75rem;font-size:1.25rem;font-weight:bolder;flex-grow:1" />
		{/if}
	</div>
</div>

<Settings close={closeSettings} isHidden={isSettingsHidden} />

<style>
	.swapbutton:disabled {
		background: linear-gradient(to right, #fff1 0, #fff2 100%);
		color: var(--transparent);
	}

	#switch-background {
		--top: calc(50% - 0.25rem);
		--bottom: calc(50% + 0.25rem);
		--right: calc(100% - 3px);
		z-index: 1;
		clip-path: polygon(
			0 var(--top),
			2px var(--top),
			2px var(--bottom),
			0 var(--bottom),
			0% 100%,
			100% 100%,
			100% var(--bottom),
			var(--right) var(--bottom),
			var(--right) var(--top),
			100% var(--top),
			100% 0,
			0 0
		);
	}
	.info span {
		opacity: 50%;
	}

	span.danger {
		color: var(--mulberry);
		opacity: 90%;
	}
</style>

