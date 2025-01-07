<script lang="ts">
	import Alert from '$lib/components/swap/alerts.svelte';
	import SwapBox from '$lib/sections/Swap/SwapBox.svelte';
	import type { AlertType } from '$lib/types';
	import { onMount } from 'svelte';

	let alerts: AlertType[] = $state([]);
	let lastAlertId = 0;

	function createAlert(isError: boolean, text: string, link = "") {
		const a = { id: ++lastAlertId, isError, text, ttl: 100, link };
		alerts.push(a);
		if (isError) throw text;
	}
	function killAlert(id: number) {
		const idx = alerts.findIndex((a) => a.id === id);
		if (idx !== -1) {
			alerts = alerts.slice(0, idx).concat(alerts.slice(idx + 1));
		}
	}

	function success(message: string, link: string) {
		createAlert(false, message, link)
	}

	onMount(async () => {
		window.addEventListener("unhandledrejection", (e) => {
			const message = e.reason ?? e;
			createAlert(true, message)
		});
	});
</script>

<SwapBox {success}/>
<div class="absolute left-0 bottom-0 bg-transparent flex flex-col-reverse p-4">
	{#each alerts as a (a.id)}
		<Alert {...a} kill={() => killAlert(a.id)} />
	{/each}
</div>
