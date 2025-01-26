<script lang="ts">
	import { getSettingsManager } from "$lib/components/swap/common/inputManager.svelte";
	import { orderData, swapData } from "$lib/states/swap/swap-states.svelte";

    let { isOrders = false } = $props();

    let { slippage, deadline } = getSettingsManager();

    let slippageText = $state(slippage.oninput(swapData.settings.slippage.toString()));
    let deadlineText = $state(
        isOrders
            ? deadline.oninput(orderData.deadline.toString(), true)
            : deadline.oninput(swapData.settings.deadline.toString(), false)
    );

    function onDeadlineInput(e: Event & { currentTarget: EventTarget & HTMLInputElement; }) {
        deadlineText = deadline.oninput(e.currentTarget.value, isOrders);
        e.currentTarget.value = deadlineText;
    }

    function onSlippageInput(e: Event & { currentTarget: EventTarget & HTMLInputElement; }) {
        slippageText = slippage.oninput(e.currentTarget.value);
        e.currentTarget.value = slippageText;
    }
</script>


<div class="flex items-start m-5 max-[450px]:flex-col">
    {#if !isOrders}
        <div class="flex grow">
            <span class="text-lg mr-5">Slippage:</span>
            <input placeholder="Insert" value={slippageText} oninput={onSlippageInput} />
        </div>
    {/if}
    <div class="flex grow max-[450px]:mt-3">
        <span class="text-lg mr-5 ml-auto">Deadline:</span>
        <input placeholder="Insert" value={deadlineText} oninput={onDeadlineInput} />
        {#if isOrders}
            <span class="text-lg mr-5 font-medium">days</span>
        {/if}
    </div>
</div>

<style>
	input {
		all: unset;
		margin-right: 12px;
		border: solid 1px #ed32bf;
		border-radius: 1rem;
		width: 5em;
        text-align: center;
        font-size: medium;
        font-weight: 300;
		&::placeholder {
            color: #fff8;
		}
	}
</style>

