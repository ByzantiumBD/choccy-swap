<script lang="ts">
	import Spinner from '$lib/components/common/spinner.svelte';
import PoolEntry from '$lib/components/pools/PoolEntry.svelte';
	import PoolSearchBar from '$lib/components/pools/PoolSearchBar.svelte';
	import { getFilteredPairs, loadPairs } from '$lib/states/pools/pool-state-interactions.svelte';
	import { poolsData } from '$lib/states/pools/pool-states.svelte';
	import { getId } from '$lib/utils';
	import { onMount } from 'svelte';

	let shownPairs = $derived.by(getFilteredPairs)

	onMount(() => {
		if (poolsData.allPairs.length === 0) loadPairs()
	});
</script>

<div class="max-w-[1000px] h-screen w-full px-5 flex flex-col">
	<div class="allcenter mx-5 mt-32 mb-8 !justify-between max-[500px]:flex-col ">
		<h1 class="max-[500px]:self-start grow basis-1 text-5xl font-bold text-white">Pools</h1>
		<PoolSearchBar />
	</div>

	<div class="header px-5 flex self-stretch text-white opacity-50 text-lg mb-3">
		<div class="identifier flex basis-1 grow">
			<span class="logo mr-4">Logo</span>
			<span class="name mr-1">Name</span>
			<span class="ticker">(Ticker)</span>
		</div>
		<div class="money flex basis-1 grow mr-[40px]">
			<span class="address max-[800px]:hidden">Address</span>
			<span class="max-[630px]:hidden tvl">TVL&nbsp;(CCY)</span>
			<span class="max-[570px]:hidden price">Price</span>
		</div>
	</div>
	<div class="overflow-y-scroll mb-auto">
		{#each shownPairs as state (getId(state.pair.id))}
			<PoolEntry id={state.pair.id} />
		{:else}
			{#if poolsData.allPairs.length === 0}
				<Spinner />
			{/if}
		{/each}
	</div>
	<div class="foot my-8 text-sm text-white text-center opacity-50">
		All tokens are paired against Choccy. All prices are estimates. Trade at your own risk.
	</div>
</div>

<style>
	span {
		text-align: center;
	}
	.logo {
		width: 45px;
	}
	.money > span {
		flex: 1 0 1px;
	}
</style>
