<script lang="ts">
	import { makeStringValueReadablePrice } from '$lib/number-utils';
	import type { Order } from '$lib/types';
	import { createAmountFromBalance, op } from '@chromia/ft4';
	import ReadablePrice from '../common/readablePrice.svelte';
	import { PRICE_PRECISION } from '$lib/interactions/swaps';
	import { stringFromGtvPrice } from '$lib/states/swap/order-state-interactions.svelte';
	import { connectionState } from '$lib/states/shared/connection-state.svelte';
	import { ordersData } from '$lib/states/orders/order-states.svelte';
	import { loadOrders } from '$lib/states/orders/order-state-interactions.svelte';

	let { order }: { order: Order } = $props();
    let decimalsDiff=$derived(order.pair.asset1.decimals - order.pair.ccy.decimals)

    let amount1 = $derived.by(()=>{
        if (order.buyCcy) {
            return order.amount
        } else {
            return createAmountFromBalance(
                (order.amount.value * order.price) / PRICE_PRECISION,
                order.pair.asset1.decimals
            )
        }
    })
    let amountCcy = $derived.by(()=>{
        if (!order.buyCcy) {
            return order.amount
        } else {
            return createAmountFromBalance(
                (order.amount.value * PRICE_PRECISION) / order.price,
                order.pair.ccy.decimals
            )
        }
    })

    function formatDate(d: Date) {
        return `${d.getFullYear()}/${d.getMonth()}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}`
    }

    async function onclick() {
        await connectionState.session!.call(op("remove_order", order.id))
            .on("built", () => {ordersData.allOrders = ordersData.allOrders.filter(o => o.id.compare(order.id) !== 0)})
        loadOrders(true);
    }
</script>

<div
	class="flex grow p-5 rounded-3xl border-2 text-white mb-4
    {order.buyCcy? 'border-[#c54b8c88]' : 'border-[#9dfff988]'}
    {order.buyCcy ? 'bg-[#c54b8c55]' : 'bg-[#9dfff955]'}">

	<span class="mr-6 text-2xl font-semibold flex items-center">{order.buyCcy ? 'Sell' : 'Buy'}</span>

    <div class="flex flex-1 items-center">
        <img class="w-[30px] mr-2" src={order.pair.asset1.iconUrl} alt=""/>      
        <span class="font-semibold flex text-lg">
                <ReadablePrice {...makeStringValueReadablePrice(amount1.toString())}/> 
            <span class="ml-1"> {order.pair.asset1.symbol} </span> 
        </span>

        <span class="mx-2"> for </span>

        <img class="w-[30px] mr-2" src={order.pair.ccy.iconUrl} alt=""/>
        <span class="font-semibold flex text-lg">
                <ReadablePrice {...makeStringValueReadablePrice(amountCcy.toString())} />
            <span class="ml-1"> {order.pair.ccy.symbol} </span>
        </span>
    </div>

    <div class="flex flex-1 items-center text-base mx-auto">
        <span class="flex mr-4">
                <ReadablePrice class="" {...makeStringValueReadablePrice(stringFromGtvPrice(order.price, false, decimalsDiff))} />
            <span class="ml-1"> {order.pair.asset1.symbol}/CUSD </span>
        </span>
        <span class=""> Deadline: {formatDate(order.deadline)} </span>
    </div>    

    <button {onclick} class="ml-4 text-lg font-bold bg-[var(--lilac)] rounded-3xl py-2 px-4 clickable"> Remove Order </button>
</div>
