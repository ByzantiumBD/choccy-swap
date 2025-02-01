<script lang="ts">
	import { isProMode } from '$lib/states/swap/swap-states.svelte';
	import Walletconnector from '../swap/common/walletconnector.svelte';
	import Animatedarrow from '../swap/pro/animatedarrow.svelte';

	let { isSwap, close } = $props();

	function changeProMode() {
		isProMode.value = !isProMode.value;
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div onclick={close} class="contents">
	<div id="links" class="allcenter space-x-8 min-[780px]:mr-8 font-medium">
		<a href="/pools" class=""> Pools </a>
	</div>
	{#if isSwap}
		<button
			onclick={changeProMode}
			class="{isProMode.value ? 'clicked' : ''} promode min-[780px]:mr-5 clickable font-semibold"
		>
			PRO Mode
			<Animatedarrow isClicked={isProMode.value} />
		</button>
		<Walletconnector />
	{:else}
		<a href="/" class="clickable pinkbutton py-2 px-7 font-semibold pinkpill"> Swap Now </a>
	{/if}
</div>

<style lang="less">
	.pinkpill {
		border: 2.5px solid var(--mulberry);
		&:hover {
			border: 2.5px solid var(--pink);
		}
	}

	.promode {
		border-radius: 32px;
		border: 2.34px solid #b57edc;
		padding: 8px 28px;
		display: flex;
		&.clicked {
			padding: 0.375rem 1.25rem;
		}
	}
</style>
