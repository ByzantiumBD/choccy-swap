import { orderData, swapData } from '$lib/states/swap/swap-states.svelte';
import { updateInputs } from '$lib/states/swap/swap-state-interactions.svelte';
import { createAmount, createAmountFromBalance, type Amount } from '@chromia/ft4';
import { ensureInputIsDecimalNumber, match, removeTrailingZeros, shortenNumber } from '$lib/number-utils';

export function getInputManager(isInput: boolean) {
    const input = $derived(isInput ? swapData.input1 : swapData.input2);

	function oninput(text: string) {
		const decimals = (isInput? swapData.token1:swapData.token2)?.asset.decimals ?? 18;
		const newText = ensureInputIsDecimalNumber(text, decimals)
        
        if (isInput) {
            swapData.input1 = createAmount(newText ? newText : '0', decimals);
        } else {
            swapData.input2 = createAmount(newText ? newText : '0', decimals);
        }
        updateInputs(isInput);
        
        return newText !== removeTrailingZeros(text) ? newText : text;
    }

    function setBalance(amountOwned: Amount | undefined, percent: number) {
        const newAmount = (amountOwned?.value ?? 0n) * BigInt(percent) / BigInt(100);
        if (isInput) {
            swapData.input1 = createAmountFromBalance(newAmount, swapData.input1.decimals);
        } else {
            swapData.input2 = createAmountFromBalance(newAmount, swapData.input2.decimals);
        }
        updateInputs(isInput)
    }

    function effect(currentText: string) {
        if (input.value === 0n && !currentText.match(/^0*\.?0*$/)) {
            return '';
        }
        const txt = removeTrailingZeros(currentText);
        if (!match((txt ? txt : '0'), input.toString(), input.decimals)) {
            return shortenNumber(input.toString());
        }
        return currentText;
    };

    return {
        oninput,
        setBalance,
        effect,
    }
}

export function getSettingsManager() {
    function onSlippageInput(newText: string) {
        let text = newText;
    
        if (text === '.') text = '0.';
        text = text.replaceAll(/[^0-9.]/g, '');
        text = text.replaceAll(/(?<=\..*)\./g, '');
    
        text = text.slice(0, 6);
        const customSlippageValue = Math.min(Number(text), 100);
    
        if (customSlippageValue === 100) {
            text = "100";
        }
    
        swapData.settings.slippage = customSlippageValue;
        return text;
    };

    function onDeadlineInput(newText: string, isOrders: boolean) {
        let text = newText;
    
        text = text.replaceAll(/[^0-9]/g, '');
        if (isOrders) {
            orderData.deadline = Math.min(100, Math.max(Number(text), 1));
            text = orderData.deadline.toString();
        } else {
            swapData.settings.deadline = Math.min(100, Math.max(Number(text), 1));
            text = swapData.settings.deadline.toString();
        }
    
        return text;
    };

    function selectSlippage(value: number) {
        swapData.settings.slippage = value
    }

    return {
        slippage: {
            oninput: onSlippageInput,
            select: selectSlippage,
        },
        deadline: {
            oninput: onDeadlineInput,
        },
    }
}

