<script>
    import TokenPill from './TokenPill.svelte';
	import switchImage from "$lib/images/swap/switch.svg";
	import { switchTokens } from '$lib/states/swap/swap-state-interactions.svelte';

</script>

<div class="flex justify-center p-3 rounded-full">

    <TokenPill input/>

    <button onclick={switchTokens}>
        <img class="w-[50px] rotate-90 mx-3 border-2 border-[#fff5] rounded-full" src={switchImage} alt="switch tokens" />
    </button>

    <TokenPill />

</div>