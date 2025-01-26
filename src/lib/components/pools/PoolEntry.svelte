<script lang="ts">
	import arrowhoriz from '$lib/images/common/arrowhoriz.svg';
	import { getReadablePriceInCcy, getReadableTvlCcy } from '$lib/number-utils';
	import Tokenimg from '$lib/components/common/tokenimg.svelte';
	import { goto } from '$app/navigation';
	import ReadablePrice from '$lib/components/common/readablePrice.svelte';
	import { onMount } from 'svelte';
	import { updatePairStats } from '$lib/states/pools/pool-state-interactions.svelte';
	import { poolsData } from '$lib/states/pools/pool-states.svelte';
	import Linkid from '../common/linkid.svelte';

	const TWENTY_SECONDS = 20000;
	let { id }: { id: Buffer } = $props();
	let { loading, pair } = $derived(
		poolsData.allPairs.find(p => p.pair.id.compare(id) === 0)!
	);

	function onclick() {
		goto('/pools/' + pair.id.toString('hex'));
	}

	onMount(()=> {
		const timerId = setInterval(() => updatePairStats(id), TWENTY_SECONDS)
		return () => clearInterval(timerId);
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	{onclick}
	class="flex clickable poolentry mb-2 rounded-3xl items-center p-5 {loading ? "text-[#fff8]":"text-white"} text-xl w-full"
>
	<div class="identifier flex items-center overflow-hidden text-ellipsis flex-[1_1_0.25rem]">
		<Tokenimg class="mr-4 w-[45px] h-[45px]" src={pair.asset1.iconUrl} alt="logo" />
		<div class="name flex">
			<div class="mr-1 shrink">{pair.asset1.name}</div>
			<div class="opacity-80 shrink">({pair.asset1.symbol})</div>
		</div>
	</div>
	<div class="max-[570px]:hidden money flex basis-1 grow items-center">
		<Linkid buttonOrLinkClass="max-[800px]:hidden" id={id} button imgClass="w-[18px]"/>
		<div class="max-[630px]:hidden grow basis-1">
			{getReadableTvlCcy(pair)}
		</div>
		<div class="grow basis-1 flex justify-center">
			<ReadablePrice fontSize={1.25} {...getReadablePriceInCcy(pair)} />
			<span class="ml-2">CCY</span>
		</div>
	</div>
	<div class="w-[40px] h-[40px]">
		<img src={arrowhoriz} alt="logo" />
	</div>
</div>

<style lang="less">
	.poolentry {
		backdrop-filter: blur(500px);
		border: solid #1a1a1a 2px;
		position: relative;
		text-align: center;
		transition: transform 0.25s ease, filter 0.25s ease;
		&:hover {
			background-image: linear-gradient(to right, #ff02d188 0, #8eeafc88 100%);
			border-color: #fff8;
		}
	}
	.name {
		flex: 1 1 auto;
		justify-content: start;
		& > div {
			overflow: hidden;
			text-overflow: ellipsis;
			text-align: left;
		}
	}
</style>
