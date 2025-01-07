<script lang="ts">
	import type { Asset } from '@chromia/ft4';
	import Tokenimg from '$lib/components/swap/tokenimg.svelte';

	interface Props {
		asset: Asset;
		selectToken: (a: Asset) => void;
	}

	let { asset, selectToken }: Props = $props();

	function onclick() {
		selectToken(asset);
	}
</script>

<button {onclick} class="allcenter shrink-0 border-[1px] border-gray-600 rounded-3xl py-2 px-3">
	<Tokenimg class="w-[28px] h-[28px] mr-2" src={asset.iconUrl} alt="token" />
	<span class="text-white font-bold text-sm">{asset.name}</span>
</button>
