<script lang="ts">
	import Background from '$lib/components/common/background.svelte';
	import '@fontsource/roboto';
	import '../app.less';
	import { page } from '$app/state';
	import Header from '$lib/components/common/header.svelte';
	import { onMount } from 'svelte';
	import { connect } from '$lib/interactions/connection';
	import Spinner from '$lib/components/common/spinner.svelte';

	let { children } = $props();

	let isSwap = $derived(page.url.pathname === "/");
	let loading = $state(true)

	onMount(async () => {
		await connect()
		loading = false;
	})
</script>

<div class="overflow-hidden relative bg-black min-h-screen flex flex-col justify-between">
	<Header {isSwap} />

	<Background>
		{#if loading}
			<Spinner />
		{:else}
			{@render children()}
		{/if}
	</Background>
</div>
