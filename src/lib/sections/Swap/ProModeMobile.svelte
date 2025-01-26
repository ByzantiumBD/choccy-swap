<script lang="ts">
	import FloatingLiquidity from '$lib/components/swap/pro/FloatingLiquidity.svelte';
	import FloatingOrders from '$lib/components/swap/pro/FloatingOrders.svelte';
	import FloatingSwap from '$lib/components/swap/pro/FloatingSwap.svelte';
	import OrderPro from '$lib/components/swap/pro/mobile/OrderPro.svelte';
	import Topbar from '$lib/components/swap/pro/topbar.svelte';
	import { ensureCorrectPair } from '$lib/states/swap/liquidity-state-interactions.svelte';
	import { setSinglePair } from '$lib/states/swap/swap-state-interactions.svelte';
	const SWAP = "swap";
	const ORDERS = "orders";
	const LIQUIDITY = "liquidity";

	let { success }: { success: (msg: string, link: string) => ()=>void } = $props();

	let selectedTab = $state(SWAP);

	$effect(() => {
		if(selectedTab !== SWAP) {
			setSinglePair(true);
			ensureCorrectPair();
		} else {
			setSinglePair(false);
		}
	})

	function setActive(tab: string) {
		selectedTab = tab;
	}
</script>

<div class="flex self-stretch flex-col mt-20 text-white">
	<Topbar />
	<div class="grow flex flex-col">
		<div class="min-h-[300px] allcenter bg-[#0008] boxblur">
			<span>Chart not yet available</span>
		</div>

		<OrderPro isSwap={selectedTab === SWAP} />
	</div>

	<div class="floatings w-full items-stretch text-xl font-semibold justify-around">
		<div class="floating">
			<div class="bg-black py-3 px-5">
				<div class="flex items-stretch justify-stretch">
					<button class="flex-grow {selectedTab === SWAP ? 'active' : ''}" onclick={() => setActive(SWAP)}>
						<span>Swap</span>
					</button>
					<button class="flex-grow {selectedTab === ORDERS ? 'active' : ''}" onclick={() => setActive(ORDERS)}>
						<span>Orders</span>
					</button>
					<button class="flex-grow {selectedTab === LIQUIDITY ? 'active' : ''}" onclick={() => setActive(LIQUIDITY)}>
						<span>Liquidity</span>
					</button>
				</div>
			</div>
				{#if selectedTab === SWAP}
					<FloatingSwap {success} />
				{:else if selectedTab === ORDERS}
					<FloatingOrders {success} />
				{:else if selectedTab === LIQUIDITY}
					<FloatingLiquidity {success} />
				{/if}
		</div>
	</div>
</div>

<style>
	.boxblur {
		backdrop-filter: blur(15px);
	}
	.floating {
		background-color: #1a1a1a;
		border-radius: 2rem;
	}
	.active {
		text-decoration: underline;
		text-decoration-color: #ed32bf;
		text-underline-offset: 0.5rem;
		text-decoration-thickness: 3px;
	}
</style>
