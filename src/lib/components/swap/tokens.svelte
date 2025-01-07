<script lang="ts">
	import CloseSvg from '$lib/images/swap/close.svelte';
	import { onMount } from 'svelte';
	import Tokenpill from './tokenpill.svelte';
	import Tokenentry from './tokenentry.svelte';
	import { getFavoriteAssets, searchAssets, getCcy } from '$lib/interactions/utils';
	import { getConnection } from '$lib/interactions/connection';
	import type { Asset, Connection } from '@chromia/ft4';
	import Searchbox from './searchbox.svelte';
	import type { Paginator, Pair } from '$lib/types';
	import { filterAssets, getAssetFilter } from '$lib/utils';

	let { close, isHidden, selectToken } = $props();

	let connection: Connection | undefined = $state(undefined);

	let name: HTMLButtonElement | undefined = $state(),
		symbol: HTMLButtonElement | undefined = $state(),
		id: HTMLButtonElement | undefined = $state();
	let currentFilter = $state(0);

	let ccy: Asset | undefined = $state(undefined);

	let pillAssets: Asset[] = $state([]);
	let filtered = $state(true);
	let allAssetPaginators: {
		byName: Paginator<Pair> | undefined;
		bySymbol: Paginator<Pair> | undefined;
		byId: Paginator<Pair> | undefined;
	} = $state({ byName: undefined, bySymbol: undefined, byId: undefined });

	let allAssets: Asset[] = $derived(getCorrectAssets(allAssetPaginators, filtered));
	let search = $state('');

	let focusSearch = $state(() => {});

	$effect(() => {
		if (connection) {
			searchAssets(connection, search).then((x) => (allAssetPaginators = x));
		}
	});

	$effect(() => {
		if (!isHidden) focusSearch();
	});

	onMount(async () => {
		const buttons = [name, symbol, id];

		buttons.forEach((b, i) => {
			b?.addEventListener('click', () => {
				buttons[currentFilter]?.classList.remove('selected');
				currentFilter = i;
				buttons[currentFilter]?.classList.add('selected');
			});
		});

		connection = await getConnection();
		ccy = await getCcy();
		pillAssets = await getFavoriteAssets(connection);
	});

	function getCorrectAssets(paginators: typeof allAssetPaginators, filtered: boolean) {
		const assets =
			[paginators.byName, paginators.bySymbol, paginators.byId][currentFilter]?.data.map(
				(d) => d.asset1
			) ?? [];
		return filtered ? filterAssets(assets) : assets;
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	onclick={close}
	class="{isHidden
		? '!hidden'
		: ''} bg-[#0008] z-10 text-white absolute top-0 left-0 w-screen h-screen allcenter"
>
	<div
		onclick={(e) => e.stopPropagation()}
		class="allcenter !items-stretch flex-col bg-black rounded-3xl border-gray-600 border w-[400px] mx-2 max-[450px]:w-[350px]"
	>
		<div class="allcenter !justify-between p-5 text-sm">
			<h2 class="font-extrabold text-xl">Select Token</h2>
			<button onclick={close}><CloseSvg style="width:28px; height:28px; fill:#ff9ced" /></button>
		</div>

		<div
			class="allcenter h-full rounded-b-3xl text-gray-400 bg-[#101010] flex-col !items-stretch pt-6"
		>
			<Searchbox bind:query={search} bind:filtered bind:focus={focusSearch} />

			<div
				id="pillscroll"
				class="flex flex-row items-center space-x-2 mx-5 py-3 overflow-x-scroll"
			>
				{#each pillAssets as asset}
					<Tokenpill {selectToken} {asset} />
				{/each}
			</div>
			<div
				id="token-nav-buttons"
				class="allcenter mt-3 !justify-around text-sm font-semibold text-[#fff8]"
			>
				<button bind:this={name} class="roadmap-buttons selected">Name</button>
				<button bind:this={symbol} class="roadmap-buttons">Ticker</button>
				<button bind:this={id} class="roadmap-buttons">Address</button>
			</div>
			<hr class="opacity-10 mt-3" />
			<div class="grow flex items-stretch h-[270px] overflow-y-scroll flex-col">
				{#if ccy}
					<Tokenentry {selectToken} asset={ccy} pinned filter={getAssetFilter(0)} />
				{/if}
				{#each allAssets as asset}
					<Tokenentry {selectToken} {asset} filter={getAssetFilter(currentFilter)} />
				{/each}
			</div>
			<hr class="opacity-10" />
			<div class="allcenter p-4 text-xs text-center">
				Trading tokens listed here might pose risks to the end user. Do your own research.
			</div>
		</div>
	</div>
</div>

<style lang="css">
	.roadmap-buttons {
		padding: 0 0.5rem 0.1rem 0.5rem;
		&.selected {
			color: #fff;
			border-bottom: solid #ed32bf 3px;
		}
	}

	#pillscroll {
		transition: all 0.25s ease-in-out;
	}
</style>
