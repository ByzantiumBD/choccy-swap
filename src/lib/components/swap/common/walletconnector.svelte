
<script lang="ts">
	import { modal } from "$lib/interactions/reown.svelte";
	import { isConnected } from "$lib/states/shared/connection-state.svelte";
	import Accountmanager from "./accountmanager.svelte";

	let { style="" }: { style?: string } = $props()

    let connected: boolean = $derived.by(isConnected)
    let isHidden: boolean = $state(true)

    function connect() {
        modal.open();
    }

	function openInfo() {
		isHidden = false;
	}
	function close() {
		isHidden = true;
	}
</script>

{#if connected}
    <button {style} onclick={openInfo} class="clickable pinkpill py-2 px-7 font-semibold">
        Account Info
    </button>
{:else}
    <button {style} onclick={connect} class="clickable pinkpill py-2 px-7 font-semibold">
        Connect Wallet
    </button>
{/if}

{#if !isHidden}
	<Accountmanager {close} />
{/if}

<style lang="less">
	.pinkpill {
		border: 2.5px solid var(--mulberry);
		&:hover {
			border: 2.5px solid var(--pink);
		}
	}
</style>