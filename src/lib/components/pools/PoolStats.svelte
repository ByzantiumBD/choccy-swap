<script lang="ts">
	import Tokenimg from '$lib/components/common/tokenimg.svelte';
	import { getReadablePriceInCcy, getReadableTvlCcy } from '$lib/number-utils';
	import type { Pair } from '$lib/types';
	import type { Asset } from '@chromia/ft4';
	import ReadablePrice from '../common/readablePrice.svelte';
	import Linkid from '../common/linkid.svelte';
	import { onMount } from 'svelte';
	import { getPairInfo } from '$lib/interactions/swaps';

	let loading: boolean = $state(true);
	// eslint-disable-next-line no-undef
	let updater: NodeJS.Timeout | undefined = $state(undefined);

	const NULL_ID = Buffer.from(
		'0000000000000000000000000000000000000000000000000000000000000000',
		'hex'
	);
	const NULL_ASSET: Asset = {
		id: NULL_ID,
		name: '...',
		symbol: '...',
		decimals: 0,
		blockchainRid: NULL_ID,
		iconUrl: '...',
		type: '...',
		supply: 0n
	};

	let { id }: { id: string } = $props();
	let p: Pair = $state({
		asset1: NULL_ASSET,
		amount1: 0n,
		amountCcy: 0n,
		id: NULL_ID,
		name: '...-...',
		ccy: NULL_ASSET,
		lpToken: NULL_ASSET
	} as Pair);

	async function updatePair() {
		loading = true;
		p = await getPairInfo(id)
		loading = false;
		if (p.id.compare(NULL_ID) === 0) {
			updater = setTimeout(updatePair, 2000);
		} else {
			updater = setTimeout(updatePair, 20000);
		}
	}

	onMount(() => {
		updatePair();
		return () => clearTimeout(updater);
	});
</script>

<div class="boxblur bg-[#101010a0] rounded-3xl pb-3 {loading? "text-[var(--transparent)]":""}">
	<div class="bg-black self-stretch text-2xl font-bold rounded-t-3xl px-5 py-4">Stats</div>
	<div class="flex items-center p-3 ml-2">
		<Tokenimg class="w-[40px] h-[40px] mr-2" src={p.asset1.iconUrl} alt="" />
		<span class="font-bold text-2xl mr-auto">{p.asset1.name}</span>
		<span class="text-lg opacity-50 mr-4">({p.asset1.symbol})</span>
	</div>

	<hr class="border-1 border-[var(--border)] mx-3" />

	<div class="flex flex-col items-start justify-center p-3 ml-4">
		<span class="gradient bordered py-1 px-3 my-2 text-sm"> Address</span>
		<Linkid id={p.asset1.id} buttonOrLinkClass="ml-3 text-xl"
				imgClass="w-[20px]"/>

		<span class="gradient bordered py-1 px-3 my-2 text-sm"> TVL</span>
		<span class="ml-3 text-3xl font-extrabold flex items-end">
			{getReadableTvlCcy(p)}
			<span class="opacity-50 text-base ml-1">CCY</span>
		</span>

		<span class="gradient bordered py-1 px-3 my-2 text-sm"> Price</span>
		<span class="ml-3 text-3xl font-extrabold flex items-end">
			<ReadablePrice {...getReadablePriceInCcy(p)} fontSize={1.875} />
			<span class="opacity-50 text-base ml-1">CCY</span>
		</span>

		<div class="flex items-center">
			<span class="gradient bordered py-1 px-3 my-2 text-sm"> LP Address</span>
			<img class="w-[27px] h-[27px] ml-2" src="https://www.choccyswap.com/logo_lp.svg" alt="lp token"/>
		</div>
		
		<Linkid id={p.lpToken.id} buttonOrLinkClass="ml-3 text-xl"
				imgClass="w-[20px]"/>
	</div>
</div>

