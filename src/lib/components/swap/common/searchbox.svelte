<script lang="ts">
	import searchSvg from '$lib/images/swap/search.svg';
	import Filter from '$lib/images/swap/filter.svelte';
	import { onMount } from 'svelte';
	type Props = {
		filtered: boolean,
		query: string,
		focus: () => void
	};

	let {
		filtered = $bindable(),
		query = $bindable(),
		focus = $bindable()
	}: Props = $props();

	let input: HTMLInputElement | undefined = $state(undefined);

	function onclick() {
		if (input) input.focus()
	}

	onMount(()=>{focus = onclick;});
</script>

<div class="allcenter mx-5">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div onclick={focus}
		class="gradientborder allcenter px-5 py-2 space-x-auto mr-3 grow"
	>
		<input bind:this={input} bind:value={query} placeholder="Search a token" />
		<img class="w-[30px] h-[30px]" src={searchSvg} alt="search token" />
	</div>
	<button
		class="{filtered ? 'pink' : 'black'} text-sm allcenter p-[0.08rem_0_0_0.08rem] relative rounded-full w-[35px] h-[35px]"
		onclick={() => filtered = !filtered}><Filter /></button
	>
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

	.gradientborder {
		border-radius: 60cm;
		border: solid 1px transparent;
		background: linear-gradient(to right, #101010 0%, #101010 100%) padding-box,
		linear-gradient(to right, #ed32bf 0%, #8eeafc 100%) border-box;
	}
</style>