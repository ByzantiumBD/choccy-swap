
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
    <button {style} onclick={openInfo} class="clickable pinkbutton font-semibold">
        Account Info
    </button>
{:else}
    <button {style} onclick={connect} class="clickable pinkbutton font-semibold">
        Connect Wallet
    </button>
{/if}

{#if !isHidden}
	<Accountmanager {close} />
{/if}

<style lang="less">
	.pinkbutton {
		background: linear-gradient(276.31deg, #ed32bf -10.17%, #b5178e 97.19%);
		border-radius: 32px;
		backdrop-filter: blur(5.538px);
		border: 2.34px solid #b5178e;
		padding: 0.375rem 1.75rem;
		flex-grow: 1;

		&:hover {
			border: 2.34px solid rgba(255, 255, 255, 0.326);
		}
	}
</style>