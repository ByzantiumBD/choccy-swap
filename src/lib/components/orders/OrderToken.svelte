<script>
	import Tokens from '../swap/common/tokens.svelte';
	import arrow from '$lib/images/common/arrowcyan.svg';
	import { connectionState } from '$lib/states/shared/connection-state.svelte';
	import Tokenimg from '../common/tokenimg.svelte';
	import { swapData } from '$lib/states/swap/swap-states.svelte';

    let token = $derived(swapData.token1);
	let isTokensHidden = $state(true);

	function closeTokens() {
		isTokensHidden = true;
	}
	function openTokens() {
		isTokensHidden = false;
	}
</script>

<button
	onclick={() => openTokens()}
	class="{connectionState.loading
		? 'disabled'
		: ''} clickable allcenter gradient bordered rounded-full py-2 px-3 font-bold"
>
	{#if token?.asset !== undefined}
		<Tokenimg src={token.asset.iconUrl} alt="token logo" class="ml-1 mr-2" style="width:32px;height:32px" />
		{token.asset.name}
	{:else}
		Choose Token
	{/if}
	<img src={arrow} alt="choose token" class="w-[30px] h-[30px]" />
</button>
<Tokens pos0 isInput={true} close={closeTokens} isHidden={isTokensHidden} />

