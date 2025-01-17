<script lang="ts">
	import { shortenId } from '$lib/utils';
	import externallink from '$lib/images/common/externallink.svg';
	import { connectionState } from '$lib/states/shared/connection-state.svelte';
	import type { BufferId } from 'postchain-client';
	type Props = {
		id: BufferId | undefined;
		buttonOrLinkClass?: string;
		spanClass?: string;
		imgClass?: string;
		button?: boolean;
		account?: boolean;
		evm?: boolean;
	};

	let {
        id,
        buttonOrLinkClass = '',
        spanClass = '',
        imgClass = '',
        button = false,
        account = false,
        evm = false,
    }: Props = $props();

	let text = $derived(id? shortenId(id): "...");
	let href = $derived.by(() => {
        if (!id) return "";
		const base = 'https://explorer.chromia.com/testnet/';
		const baseEvm = 'https://etherscan.io/address/';
		const chainId = connectionState.connection!.blockchainRid.toString("hex");
		const path = (account ? '/account/' : '/asset/');
        const _id = id.toString('hex');
		return evm? baseEvm + _id : base + chainId + path + _id;
	});

	function onclick(e: Event & { currentTarget: HTMLButtonElement }) {
		e.stopPropagation();
		window.open(href, '_blank')?.focus();
	}
</script>

{#if button}
	<button {onclick} class="flex {buttonOrLinkClass}">
		<span class="{spanClass} text-[#fff8]">
			{text}
		</span>

		<img class="{imgClass} ml-1" src={externallink} alt="open explorer" />
	</button>
{:else}
	<a {href} target="_blank" class="flex {buttonOrLinkClass}">
		<span class="{spanClass} text-[#fff8]">
			{text}
		</span>

		<img class="{imgClass} ml-1" src={externallink} alt="open explorer" />
	</a>
{/if}

<style>
    img {
        width: 18px;
    }
</style>