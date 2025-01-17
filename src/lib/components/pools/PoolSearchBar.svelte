<script lang="ts">
	import searchSvg from '$lib/images/swap/search.svg';
	import Filter from '$lib/images/swap/filter.svelte';
	import { poolsData } from '$lib/states/pools/pool-states.svelte';
	import { onMount } from 'svelte';

	let input: HTMLInputElement | undefined = $state(undefined);

	function onclick() {
		if (input) input.focus()
	}

	function oninput(e: Event & { currentTarget: HTMLInputElement }) {
		poolsData.query = e.currentTarget.value.toLowerCase();
	}

	onMount(() => {
		if (poolsData.query && input) input.value = poolsData.query
	})
</script>

<div class="max-[500px]:self-stretch max-[500px]:mt-2 basis-1 grow flex items-center">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div {onclick} class="gradientborder allcenter px-5 py-2 space-x-auto mr-3 grow">
		<input bind:this={input} {oninput} placeholder="Search a token" />
		<img class="w-[30px] h-[30px]" src={searchSvg} alt="search" />
	</div>
	<button
		class="{poolsData.showVerifiedOnly
			? 'pink'
			: 'black'} text-sm allcenter p-[0.08rem_0_0_0.08rem] relative rounded-full w-[35px] h-[35px]"
		onclick={() => (poolsData.showVerifiedOnly = !poolsData.showVerifiedOnly)}
	>
		<Filter />
	</button>
</div>

<style lang="less">
	input {
		all: unset;
		flex-grow: 1;
		background-color: transparent;
		color: white;

		&::placeholder {
			color: #fff8;
		}
		&:focus {
			outline: none;
			box-shadow: unset;
		}
	}

	.gradientborder {
		border-radius: 60cm;
		border: solid 1px transparent;
		background:
			linear-gradient(to right, #101010 0%, #101010 100%) padding-box,
			linear-gradient(to right, #ed32bf 0%, #8eeafc 100%) border-box;
	}

	button.black {
		background-color: black;
		fill: #fff8;
	}
	button.pink {
		background-color: #ff9ced;
		fill: black;
	}
	button:hover::before {
		content: 'Show only verified tokens';
		position: absolute;
		bottom: 100%;
		left: -225%;
		background-color: black;
		color: white;
		border-radius: 20px;
		width: 550%;
		padding: 5px;
	}
</style>
