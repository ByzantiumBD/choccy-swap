<script lang="ts">
	import OrderPro from '$lib/components/swap/pro/OrderPro.svelte';

	import Topbar from '$lib/components/swap/pro/topbar.svelte';
</script>

<div class="flex self-stretch flex-col grow mt-10 text-white">
	<Topbar />
	<div class="grow flex px-3">
		<div class="rounded-3xl grow mr-3 allcenter bg-[#0008] boxblur">
			<span>Not available</span>
		</div>

		<OrderPro />
	</div>

	<div class="flex grow my-3 w-full items-stretch text-xl font-semibold justify-around">
		<div class="floating">
			<button class="navigation_buttons {'selected'}">Swap</button>
		</div>
		<div class="floating">
			<button class="navigation_buttons">Orders</button>
		</div>
		<div class="floating">
			<button class="navigation_buttons">Liquidity</button>
		</div>
	</div>
</div>

<style>
	.navigation_buttons {
		padding: 0 0.5rem 0.1rem 0.5rem;
		&.selected {
			color: #fff;
			border-bottom: solid #ed32bf 3px;
		}
	}
	.boxblur {
		backdrop-filter: blur(15px);
	}
	.floating {
		background-color: #1a1a1a;
		border-radius: 2rem;
		margin: 0 0.75rem;
		flex-grow: 1;
		flex-basis: 1px;
	}
</style>
