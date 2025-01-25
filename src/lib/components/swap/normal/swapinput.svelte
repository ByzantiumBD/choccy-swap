<script lang="ts">
	import arrow from '$lib/images/common/arrow.svg';
	import Tokenimg from '$lib/components/common/tokenimg.svelte';
	import { makeNumberReadable } from '$lib/number-utils';
	import { untrack } from 'svelte';
	import Tokens from '$lib/components/swap/common/tokens.svelte';
	import { swapData } from '$lib/states/swap/swap-states.svelte';
	import { connectionState } from '$lib/states/shared/connection-state.svelte';
	import { getInputManager } from '../common/inputManager.svelte';

	type Props = {
		isInput: boolean;
	};

	let { isInput }: Props = $props();
	let tkInfo = $derived(isInput? swapData.token1 : swapData.token2);
	let text = $state('');

	let inputManager = getInputManager(isInput);

	let isTokensHidden = $state(true);

	function closeTokens() {
		isTokensHidden = true;
	}
	function openTokens() {
		isTokensHidden = false;
	}

	$effect(() => {
		const newText = inputManager.effect(untrack(() => text)) 
		if (newText !== undefined) {
			text = newText;
		}
	});

	async function oninput(e: Event & { currentTarget: HTMLInputElement }) {
		e.currentTarget.value = await inputManager.oninput(e.currentTarget.value)
	}

	function setBalance(percent: number) {
		inputManager.setBalance(tkInfo?.amountOwned, percent)
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
			{#if tkInfo?.asset !== undefined}
				<Tokenimg
					src={tkInfo!.asset.iconUrl}
					alt="token logo"
					class="ml-1 mr-2"
					style="width:32px;height:32px"
				/>
				{tkInfo!.asset.symbol}
			{:else}
				Choose Token
			{/if}
			<img src={arrow} alt="choose token" class="w-[30px] h-[30px]" />
		</button>
		<button onclick={() => setBalance(100)} class="text-sm opacity-50 mt-1 pl-3"
			>Balance: {makeNumberReadable(tkInfo?.amountOwned.toString() ?? '0')}</button
		>
	</div>
	<div class="flex flex-col items-end">
		{#if connectionState.session}
			<div class="flex text-[#fff8] text-sm">
				<button onclick={() => setBalance(25)} class="clickable mr-2">
					25%
				</button>
				<button onclick={() => setBalance(50)} class="clickable mr-2">
					50%
				</button>
				<button onclick={() => setBalance(75)} class="clickable mr-2">
					75%
				</button>
				<button onclick={() => setBalance(100)} class="clickable">
					100%
				</button>
			</div>
		{/if}
		<input
			onclick={(e) => e.currentTarget.select()}
			type="text"
			placeholder="0.00"
			class={connectionState.loading? "disabled" : ""}
			{oninput}
			bind:value={text}
		/>
		{#if tkInfo}
			<span class="text-sm opacity-50">${makeNumberReadable(swapData.input1.toString())}</span>
		{/if}
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
