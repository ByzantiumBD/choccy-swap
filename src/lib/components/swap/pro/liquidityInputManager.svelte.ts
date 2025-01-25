import { liquidityData, swapData } from '$lib/states/swap/swap-states.svelte';
import { updateInputs } from '$lib/states/swap/liquidity-state-interactions.svelte';
import { createAmount, createAmountFromBalance, type Amount } from '@chromia/ft4';
import { ensureInputIsDecimalNumber, match, removeTrailingZeros, shortenNumber } from '$lib/number-utils';
import { calcAmountsFromLpTokens } from '$lib/interactions/liquidity';

export function getLiquidityInputManager(isInput: boolean) {
	const input = $derived(isInput ? liquidityData.input1 : liquidityData.input2);
	const decimals = $derived((isInput? swapData.token1:swapData.token2)?.asset.decimals ?? 18);

	function oninput(text: string) {
		const newText = ensureInputIsDecimalNumber(text, decimals)
		if (isInput) {
			liquidityData.input1 = createAmount(newText ? newText : '0', decimals);
		} else {
			liquidityData.input2 = createAmount(newText ? newText : '0', decimals);
		}
		updateInputs(isInput);
		return newText;
	}

	function setBalance(amountOwned: Amount | undefined, percent: number) {
		const newAmount = ((amountOwned?.value ?? 0n) * BigInt(percent)) / BigInt(100);
		if (isInput) {
			liquidityData.input1 = createAmountFromBalance(newAmount, decimals);
		} else {
			liquidityData.input2 = createAmountFromBalance(newAmount, decimals);
		}
		updateInputs(isInput);
	}

	function setBalanceFromLp(amountOwned: Amount | undefined, percent: number) {
		const amountFromLp =
			amountOwned && swapData.pair1
				? calcAmountsFromLpTokens(amountOwned, swapData.pair1)
				: [0n, 0n];
		const newAmount = (amountFromLp[isInput ? 0 : 1] * BigInt(percent)) / BigInt(100);
		if (isInput) {
			liquidityData.input1 = createAmountFromBalance(newAmount, decimals);
		} else {
			liquidityData.input2 = createAmountFromBalance(newAmount, decimals);
		}
		updateInputs(isInput);
	}

	function effect(currentText: string) {
		if (input.value === 0n && !currentText.match(/^0?\.?0*$/)) {
			return '';
		}
        const txt = removeTrailingZeros(currentText);
        if (!match((txt ? txt : '0'), input.toString(), input.decimals)) {
            return shortenNumber(input.toString());
        }
        return currentText;
	}

	return {
		oninput,
		setBalance,
		setBalanceFromLp,
		effect
	};
}
