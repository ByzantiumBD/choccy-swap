<script lang="ts">
	import type { Order, Pair } from '$lib/types';
	import { createAmount, type Asset } from '@chromia/ft4';
	import OrderEntry from './OrderEntry.svelte';
	import OrderToken from './OrderToken.svelte';

    let pair = {
            asset1: {
                name: "Choccy USD",
                symbol: "CUSD",
                iconUrl: "https://choc.cy/cusd.svg",
                decimals: 18,
            } as Asset,
            ccy: {
                name: "Choccy",
                symbol: "CCY",
                iconUrl: "https://choc.cy/coin.svg",
                decimals: 18,
            } as Asset,
        } as Pair;
</script>

<div class="max-w-[1000px] h-screen w-full px-5 flex flex-col">
	<div class="allcenter mx-5 mt-32 mb-8 !justify-between max-[500px]:flex-col">
		<h1 class="max-[500px]:self-start grow basis-1 text-5xl font-bold text-white">My orders</h1>
		<OrderToken />
	</div>
    <div>
        <OrderEntry order={{buyCcy: false, pair, amount: createAmount(10000, 18)} as Order}/>
    </div>
</div>
