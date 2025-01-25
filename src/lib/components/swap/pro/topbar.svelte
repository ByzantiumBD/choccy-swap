<script lang="ts">
    import TokenPill from './TokenPill.svelte';
	import switchImage from "$lib/images/swap/switch.svg";
	import { switchTokens } from '$lib/states/swap/swap-state-interactions.svelte';
</script>

<div class="justify-center flex p-3 rounded-full">

    <div class="flex flex-1 justify-end">
        <TokenPill input/>
    </div>

    <button onclick={switchTokens}>
        <img class="w-[50px] rotate-90 mx-3 border-2 border-[#fff5] rounded-full" src={switchImage} alt="switch tokens" />
    </button>

    <div class="flex flex-1 justify-start">
        <TokenPill />
    </div>

</div>