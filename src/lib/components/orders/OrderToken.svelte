<script>
	import Tokens from '../swap/common/tokens.svelte';
	import arrow from '$lib/images/common/arrowcyan.svg';
	import { connectionState } from '$lib/states/shared/connection-state.svelte';
	import Tokenimg from '../common/tokenimg.svelte';

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
	{#if undefined !== undefined}
		<Tokenimg src={'abc'} alt="token logo" class="ml-1 mr-2" style="width:32px;height:32px" />
		{'abc'}
	{:else}
		Choose Token
	{/if}
	<img src={arrow} alt="choose token" class="w-[30px] h-[30px]" />
</button>
<Tokens isInput={true} close={closeTokens} isHidden={isTokensHidden} />

