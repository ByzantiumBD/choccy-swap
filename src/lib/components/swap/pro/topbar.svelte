<script lang="ts">
    import TokenPill from './TokenPill.svelte';
	import switchImage from "$lib/images/swap/switch.svg";
	import { switchTokens } from '$lib/states/swap/swap-state-interactions.svelte';
</script>

<div class="justify-center items-center flex p-3 rounded-full max-[780px]:flex-col">

    <div class="flex flex-1 min-[781px]:justify-end">
        <TokenPill input/>
    </div>

    <button onclick={switchTokens}>
        <img class="w-[50px] rotate-90 mx-3 border-2 border-[var(--border)] rounded-full" src={switchImage} alt="switch tokens" />
    </button>

    <div class="flex flex-1 min-[781px]:justify-start">
        <TokenPill />
    </div>

</div>