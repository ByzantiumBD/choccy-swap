<script lang="ts">
	import FloatingLiquidity from '$lib/components/swap/pro/FloatingLiquidity.svelte';
	import FloatingOrders from '$lib/components/swap/pro/FloatingOrders.svelte';
	import FloatingSwap from '$lib/components/swap/pro/FloatingSwap.svelte';
	import OrderPro from '$lib/components/swap/pro/desktop/OrderPro.svelte';
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
	<div class="grow flex px-3 max-[1000px]:flex-col">
		<div class="rounded-3xl grow mr-3 allcenter bg-[#0008] boxblur">
			<span>Not available</span>
		</div>

		<OrderPro isSwap={selectedTab === SWAP} />
	</div>

	<div class="floatings my-3 w-full items-stretch text-xl font-semibold justify-around">
		<div class="floating">
			<div class="bg-black rounded-t-3xl py-4 px-5">
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
	.floating {
		background-color: #1a1a1a88;
		backdrop-filter: blur(15px);
		border-radius: 2rem;
		margin: 0 0.75rem;
	}
	.active {
		text-decoration: underline;
		text-decoration-color: var(--mulberry);
		text-underline-offset: 0.5rem;
		text-decoration-thickness: 3px;
	}
</style>
