<script lang="ts">
	import { makeStringValueReadablePrice } from '$lib/number-utils';


	import type { Order } from '$lib/types';
	import ReadablePrice from '../common/readablePrice.svelte';

	let { order }: { order: Order } = $props();
</script>

<div
	class="flex grow p-5 rounded-3xl border-2 text-white
    {order.buyCcy? 'border-[#c54b8c88]' : 'border-[#9dfff988]'}
    {order.buyCcy ? 'bg-[#c54b8c55]' : 'bg-[#9dfff955]'}">

	<span class="text-2xl font-semibold mr-auto flex items-center">{order.buyCcy ? 'Sell' : 'Buy'}</span>

    <div class="flex items-center mr-auto">
        <img class="w-[30px] mr-2" src={order.pair.asset1.iconUrl} alt=""/>
        <span class="font-semibold flex text-lg">
            <ReadablePrice {...makeStringValueReadablePrice(order.amount.toString())}/> 
            <span class="ml-1"> {order.pair.asset1.symbol} </span> 
        </span>

        <span class="mx-2"> for </span>

        <img class="w-[30px] mr-2" src={order.pair.ccy.iconUrl} alt=""/>
        <span class="font-semibold flex text-lg">
            <ReadablePrice {...makeStringValueReadablePrice(order.amount.toString())} />
            <span class="ml-1"> {order.pair.ccy.symbol} </span>
        </span>
    </div>

    <div class="flex items-center text-base">
        <span class="mr-6"> Price: 143.87$ <!--{order.price}--> </span>
        <span> Deadline: 3 days <!--{order.deadline}--> </span>
    </div>    

    <button class="ml-auto text-lg font-bold bg-[var(--lilac)] rounded-3xl py-2 px-4"> Remove Order </button>
</div>
