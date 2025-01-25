<script lang="ts">
	import { makeNumberReadable } from "$lib/number-utils";
	import { liquidityData, swapData } from "$lib/states/swap/swap-states.svelte";
	import { untrack } from "svelte";
	import { getInputManager } from "../common/inputManager.svelte";
	import { getLiquidityInputManager } from "./liquidityInputManager.svelte";
	import { updateInputs } from "$lib/states/swap/swap-state-interactions.svelte";
	import { calcAmountsFromLpTokens } from "$lib/interactions/liquidity";
	import { createAmountFromBalance, type Amount } from "@chromia/ft4";
	import { isCcy } from "$lib/utils";
	type Props = { isInput?: boolean, liquidity?: boolean, addLiquidity?: boolean }

	let { isInput = false, liquidity = false, addLiquidity = false }: Props = $props();
	
	const inputManager = liquidity ? getLiquidityInputManager(isInput) : getInputManager(isInput);
	let text = $state('');

	let token = $derived(isInput ? swapData.token1 : swapData.token2);
	let value = $derived.by(() => {
		if (liquidity) {
			return isInput ? liquidityData.input1 : liquidityData.input2;
		} else {
			return isInput ? swapData.input1 : swapData.input2;
		}
	});

	let balance = $derived(makeNumberReadable(
		liquidity && !addLiquidity
			? balanceFromLp(liquidityData.lpToken?.amountOwned)
			: token?.amountOwned.toString() ?? "0"
	));

	$effect(() => {
		const newText = inputManager.effect(untrack(() => text)) 
		if (newText !== undefined) {
			text = newText;
		}
	});

	function balanceFromLp(amountLp: Amount | undefined) {
		if (!swapData.pair1 || !token || !amountLp) return "0";
		const lpRequired = calcAmountsFromLpTokens(
			amountLp,
			swapData.pair1,
		)
		const ccy = isCcy(token.asset);
		return createAmountFromBalance(ccy ? lpRequired[1] : lpRequired[0], token.asset.decimals).toString();
	}

	function oninput(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		e.currentTarget.value = inputManager.oninput(e.currentTarget.value)
		updateInputs(isInput)
	}
</script>

<div class="bg-[#ed32bf55] border-2 border-[#ed32bf88] rounded-2xl m-3 flex p-3">
	<div class="flex-[2_0_1px] flex flex-col">
		<span class="text-base">{token?.asset.name ?? "Select a token"}</span>
		<input {oninput} bind:value={text} placeholder="0.00" />
	</div>
	<div class="flex-[1_0_1px] flex flex-col items-end justify-center">
		<span class="text-base text-[#fff8]">Balance: {makeNumberReadable(balance.toString())}</span>
		<span class="text-base text-[#fff8]">{makeNumberReadable(value.toString())}$</span>
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
