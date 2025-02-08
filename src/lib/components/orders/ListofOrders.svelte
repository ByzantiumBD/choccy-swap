<script lang="ts">
	import OrderEntry from './OrderEntry.svelte';
	import OrderToken from './OrderToken.svelte';
	import { connectionState } from '$lib/states/shared/connection-state.svelte';
	import { getFilteredOrders, loadOrders } from '$lib/states/orders/order-state-interactions.svelte';
	import Spinner from '../common/spinner.svelte';
	import { ordersData } from '$lib/states/orders/order-states.svelte';
	import { onMount } from 'svelte';
	import { getId } from '$lib/utils';
	import { swapData } from '$lib/states/swap/swap-states.svelte';

    let loading = $state(true);
    $inspect(ordersData.allOrders)

    $effect(() => {
        loadOrders()
        loading=false;
    })

    onMount(async () => {
        await loadOrders()
        loading=false;
    })
</script>

<div class="max-w-[1000px] h-screen w-full px-5 flex flex-col">
	<div class="allcenter mx-5 mt-32 mb-8 !justify-between max-[500px]:flex-col">
		<h1 class="max-[500px]:self-start grow basis-1 text-5xl font-bold text-white">My orders</h1>
		<OrderToken />
	</div>
    <div class="h-screen overflow-y-scroll rounded-3xl">
        {#if loading}
            <Spinner />
        {:else}
            {#if connectionState.session}
                {#each getFilteredOrders(swapData.token1?.asset.id) as order (getId(order.id))}
                    <OrderEntry {order}/>
                {:else}
                    <span class="text-white text-2xl allcenter h-full">No orders found</span>
                {/each}
            {:else}
                <span class="text-white text-2xl allcenter h-full">Please connect your wallet</span>
            {/if}
        {/if}
    </div>
</div>
