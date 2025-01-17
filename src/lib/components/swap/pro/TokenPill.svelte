<script lang="ts">
	import Linkid from '$lib/components/common/linkid.svelte';
	import Tokenimg from '$lib/components/common/tokenimg.svelte';
	import { swapData } from '$lib/states/swap/swap-states.svelte';
	import Tokens from '../common/tokens.svelte';

	let { input = false }: { input?: boolean } = $props();
	let asset = $derived(input ? swapData.token1?.asset : swapData.token2?.asset);
	let isHidden = $state(true);

	function onclick() {
		isHidden = false;
	}
    function close() {
        isHidden = true;
    }
</script>

<button {onclick} class="pill clickable">
	{#if asset}
		<Tokenimg class="w-[32px] h-[32px] mr-2" src={asset.iconUrl} alt="token" />
		<span class="text-lg font-bold mr-5">{asset.name}</span>
		<Linkid button id={asset.id} />
	{:else}
		<span class="text-lg font-bold">{'Select token'}</span>
	{/if}
</button>

<Tokens isInput={input} {close} {isHidden} />

<style>
	.pill {
		backdrop-filter: blur(15px);
		border: solid 2px transparent;
		background-color: #0008;
		border-radius: 100cm;
		padding: 0.8rem 1.8rem;
		display: flex;
		align-items: center;
		&:hover {
			border-color: #fff5;
			border-width: 2px;
		}
	}
</style>
