<script lang="ts">
	import arrow from '$lib/images/common/arrow.svg';
	import Tokenimg from '$lib/components/common/tokenimg.svelte';
	import { makeNumberReadable, removeTrailingZeros, shortenNumber } from '$lib/number-utils';
	import { untrack } from 'svelte';
	import { createAmount } from '@chromia/ft4';
	import Tokens from '$lib/components/swap/common/tokens.svelte';
	import { swapData } from '$lib/states/swap/swap-states.svelte';
	import { updateInputs } from '$lib/states/swap/swap-state-interactions.svelte';
	import { connectionState } from '$lib/states/shared/connection-state.svelte';

	type Props = {
		isInput: boolean;
	};

	let { isInput }: Props = $props();
	let tkInfo = $derived(isInput? () => swapData.token1 : () => swapData.token2);

	let isTokensHidden = $state(true);
	let text = $state('');

	function closeTokens() {
		isTokensHidden = true;
	}
	function openTokens() {
		isTokensHidden = false;
	}

	$effect(() => {
		const currentText = untrack(() => text);
		const newVal = isInput? swapData.input1 : swapData.input2;
		if (newVal.value === 0n && !currentText.match(/^0?\.?0*$/)) {
			text = '';
			return;
		}
		const txt = removeTrailingZeros(currentText);
		if ((txt ? txt : '0') !== newVal.toString()) {
			text = shortenNumber(newVal.toString());
		}
	});

	async function oninput() {
		let newText = text;

		if (newText === '.') newText = '0.';
		// remove leading zeros
		newText = newText.replace(/^0+(?=[1-9])/, '');
		// remove every non-digit besides "."
		newText = newText.replaceAll(/[^0-9.]/g, '');
		// remove all "." after the first
		newText = newText.replaceAll(/(?<=\..*)\./g, '');
		const decimals = newText.match(/\.\d+/g);
		if (decimals && decimals[0]) {
			// decimals contains the dot as well
			const expected = (tkInfo()?.asset.decimals ?? 18) + 1;

			if (decimals[0].length >= expected) {
				const integer = newText.match(/^\d*/);
				newText = integer + decimals[0].slice(0, expected);
			}
		}
		const t = removeTrailingZeros(newText);
		if (isInput) {
			swapData.input1 = createAmount(t ? t : '0', tkInfo()?.asset.decimals ?? 18);
		} else {
			swapData.input2 = createAmount(t ? t : '0', tkInfo()?.asset.decimals ?? 18);
		}
		updateInputs(isInput);
		text = newText;
	}

	function maxBalance() {
		if (isInput) {
			swapData.input1 = tkInfo()?.amountOwned ?? createAmount(0, 0);
		} else {
			swapData.input2 = tkInfo()?.amountOwned ?? createAmount(0, 0);
		}
	}
</script>

<div class="swapinput h-[4cm] w-full {isInput ? 'rounded-t-3xl' : 'rounded-b-3xl'} my-1 px-6">
	<div class="floatbox flex flex-col items-start z-1">
		<span class="font-bold pl-3">
			{isInput ? 'You Pay' : 'You Receive'}
		</span>
		<button
			onclick={() => openTokens()}
			class="{connectionState.loading? "disabled" : ""} clickable allcenter bg-[#101010] rounded-full mt-1 py-2 px-3 font-bold border border-gray-600"
		>
			{#if tkInfo()?.asset !== undefined}
				<Tokenimg
					src={tkInfo()!.asset.iconUrl}
					alt="token logo"
					class="ml-1 mr-2"
					style="width:32px;height:32px"
				/>
				{tkInfo()!.asset.symbol}
			{:else}
				Choose Token
			{/if}
			<img src={arrow} alt="choose token" class="w-[30px] h-[30px]" />
		</button>
		<button onclick={maxBalance} class="text-sm opacity-50 mt-1 pl-3"
			>Balance: {makeNumberReadable(tkInfo()?.amountOwned.toString() ?? '0')}</button
		>
	</div>
	<div class="flex flex-col items-end">
		<div class="flex text-[#fff8] text-sm">
			<button class="clickable mr-2">
				25%
			</button>
			<button class="clickable mr-2">
				50%
			</button>
			<button class="clickable mr-2">
				75%
			</button>
			<button class="clickable mr-2">
				100%
			</button>
		</div>
		<input
			onclick={(e) => e.currentTarget.select()}
			type="text"
			placeholder="0.00"
			class={connectionState.loading? "disabled" : ""}
			{oninput}
			bind:value={text}
		/>
		<span class="text-sm opacity-50">${"valueInDollars"}</span>
	</div>
</div>

<Tokens {isInput} close={closeTokens} isHidden={isTokensHidden} />

<style lang="less">
	.swapinput {
		background-color: #b5178e30;
		border: 2px solid #ed32bf30;
		position: relative;
		width: 80vw;
		max-width: 600px !important;
		display: flex;
		justify-content: end;
		align-items: center;
	}

	input[type='text'] {
		all: unset;
		background-color: transparent;
		border: none;
		font-size: xx-large;
		text-align: end;
		width: 100%;
		&::placeholder {
			color: #fff8;
		}
		&:focus {
			outline: none;
		}
		&.disabled {
			color: #fff8 !important;
		}
	}
	.disabled {
		color: #fff8;
	}

	@media (max-width: 450px) {
		input[type='text'] {
			font-size: x-large;
		}
	}

	.floatbox {
		position: absolute;
		left: 1.5rem;
		width: 200px;
	}
</style>
