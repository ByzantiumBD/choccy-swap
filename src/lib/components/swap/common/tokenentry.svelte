<script lang="ts">
	import arrow from '$lib/images/common/arrowhoriz.svg';
	import pin from '$lib/images/swap/pin.svg';
	import Tokenimg from '$lib/components/common/tokenimg.svelte';

	import type { Asset } from '@chromia/ft4';
	import type { AssetFilter } from '$lib/types';
	import { getAssetFilter } from '$lib/utils';
	import Linkid from '$lib/components/common/linkid.svelte';

	interface Props {
		asset: Asset;
		pinned?: boolean;
		filter: AssetFilter;
		selectToken: (asset: Asset) => void;
	}

	let { asset, filter, selectToken, pinned = false }: Props = $props();
</script>

<button onclick={()=>selectToken(asset)} id="entry" class="{pinned? "pinned" : ""} clickable grow-0 shrink-0 text-[#fff8] allcenter h-[60px] px-5">
	<Tokenimg class="w-[30px] h-[30px] mr-2" src={asset.iconUrl} alt={asset.symbol} />
	<span class="text-sm {filter === getAssetFilter(0)? "text-white" : ""} font-bold mr-1">{asset.name}</span>
	<span class="text-sm {filter === getAssetFilter(1)? "text-white" : ""} font-bold mr-1">({asset.symbol})</span>
	{#if pinned}
		<img class="w-[20px] h-[20px]" src={pin} alt="pinned"/>
	{/if}
	<Linkid buttonOrLinkClass="items-center ml-auto" button
		spanClass="text-sm {filter === getAssetFilter(2)? "text-white" : ""}"
		id={asset.id} imgClass="w-[18px] ml-2" />
	<img class="w-[30px] h-[30px] ml-3" src={arrow} alt="" />
</button>

<style lang="less">
	#entry {
		background-color: #101010;
		&.pinned {
			background-color: #1a1a1a;
		}
		&:hover {
			background-color: black;
		}
	}
</style>
