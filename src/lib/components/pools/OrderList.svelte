<script lang="ts">
	import OrderListEntry from './OrderListEntry.svelte';
	import type { OrderInfo } from '$lib/states/shared/types';
	type Props = {
		sell?: boolean;
		orders: OrderInfo[];
		loading: boolean;
	};

	let { sell = false, orders, loading }: Props = $props();
</script>

<div class="flex flex-col grow {sell ? 'border-r' : ''} border-[#fff5]">
	<h3
		class="bg-[#0008] title {sell
			? 'sell'
			: ''} p-3 text-2xl font-bold allcenter underline decoration-2"
	>
		{sell ? 'Selling' : 'Buying'} Orders
	</h3>
	<div
		class="flex {sell
			? ''
			: 'flex-row-reverse'} items-center justify-around opacity-50 text-lg py-2"
	>
		<span class="O">Number of Orders</span>
		<span>Volume</span>
		<span>Price Range</span>
	</div>
	<hr class="border-gray-600 border-1" />
	{#each orders as info}
		<OrderListEntry order={info} {sell} {loading} />
	{:else}
		{#each { length: 6 }}
			<OrderListEntry order={undefined} {sell} loading />
		{/each}
	{/each}
</div>

<style>
	span {
		flex-grow: 1;
		flex-basis: 1px;
		text-align: center;
	}
	.title {
		border-radius: 0 1.5rem 0 0;
		text-decoration-color: #8eeafc;
		&.sell {
			border-radius: 1.5rem 0 0 0;
			text-decoration-color: #ed32bf;
		}
	}

	@media (max-width: 460px) {
		.title {
			font-size: large !important;
		}
	}
</style>
