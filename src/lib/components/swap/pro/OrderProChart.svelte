<script lang="ts">
	import type { OrderInfo } from "$lib/states/shared/types";
	import { swapData } from "$lib/states/swap/swap-states.svelte";
	import type { Pair, ReadablePriceType } from "$lib/types";
	import OrderProEntry from "./OrderProEntry.svelte";
    const SECTION_NUMBER = 4
    const EMPTY_READABLE: ReadablePriceType = { val: "...", numberOfDecimalZeros: 0 }
    const EMPTY: OrderInfo = {
        number: "...",
        volume: "...",
        symbol: "...",
        priceRange: "...",
        width: 0,
        tooltip: { one: EMPTY_READABLE, two: EMPTY_READABLE },
    }
    const NO_INFO = Array(SECTION_NUMBER).fill(EMPTY)

    type Props = {
        orders?: {
            sell: OrderInfo[],
            buy: OrderInfo[],
        },
        pair: Pair | undefined,
        loading: boolean
    }

    let { orders = { sell:NO_INFO, buy:NO_INFO }, pair, loading }: Props = $props();
</script>

<div class="allcenter self-stretch mx-5 mt-3">
    <div class="flex-1 flex flex-col items-end pr-3">
        {#each orders.sell as sell}
            <OrderProEntry order={sell} sell {loading}/>
        {/each}
    </div>
    <div class="flex-1 flex flex-col border-l border-[#fff8] pl-3">
        {#each orders.buy as buy}
            <OrderProEntry order={buy} {loading}/>
        {/each}
    </div>
</div>