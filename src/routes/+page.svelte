<script lang="ts">
	import Alert from '$lib/components/swap/common/alerts.svelte';
	import SwapBox from '$lib/sections/Swap/SwapBox.svelte';
	import ProMode from '$lib/sections/Swap/ProMode.svelte'
	import type { AlertType } from '$lib/types';
	import { onMount } from 'svelte';
	import { isProMode } from '$lib/states/swap/swap-states.svelte';
	import { loadQueryParams } from '$lib/states/swap/swap-state-interactions.svelte';
	import ProModeMobile from '$lib/sections/Swap/ProModeMobile.svelte';

	let alerts: AlertType[] = $state([]);
	let lastAlertId = 0;

	function createAlert(isError: boolean, text: string, link = "") {
		const a = { id: ++lastAlertId, isError, text, ttl: 100, link };
		alerts.push(a);
		return () => killAlert(a.id);
	}
	function killAlert(id: number) {
		const idx = alerts.findIndex((a) => a.id === id);
		if (idx !== -1) {
			alerts = alerts.slice(0, idx).concat(alerts.slice(idx + 1));
		}
	}

	function success(message: string, link: string) {
		return createAlert(false, message, link)
	}

	onMount(async () => {
		window.addEventListener("unhandledrejection", (e) => {
			const message = e.reason ?? e;
			createAlert(true, message)
		});
		await loadQueryParams();
	});
</script>

{#if isProMode.value}
	<div class="contents max-[1000px]:hidden">
		<ProMode {success} />
	</div>
	<div class="contents min-[1001px]:hidden">
		<ProModeMobile {success} />
	</div>
{:else}
	<SwapBox {success}/>
{/if}
<div class="absolute left-0 bottom-0 bg-transparent flex flex-col-reverse p-4">
	{#each alerts as a (a.id)}
		<Alert {...a} kill={() => killAlert(a.id)} />
	{/each}
</div>

