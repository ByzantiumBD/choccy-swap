<script lang="ts">
	import FloatingLiquidity from '../../components/swap/pro/FloatingLiquidity.svelte';
	import FloatingOrders from '../../components/swap/pro/FloatingOrders.svelte';
	import FloatingSwap from '../../components/swap/pro/FloatingSwap.svelte';
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

	<div class="flex my-3 w-full items-stretch text-xl font-semibold justify-around">
		<FloatingSwap />
		<FloatingOrders />
		<FloatingLiquidity />
	</div>
</div>

<style>
	.boxblur {
		backdrop-filter: blur(15px);
	}
</style>
