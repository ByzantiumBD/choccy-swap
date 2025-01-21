<script lang="ts">
	import ProInputs from './ProInputs.svelte';
</script>

<div class="floating flex flex-col justify-start">
	<div class="bg-black rounded-t-3xl py-3 px-5">
		<button class="navigation_buttons">Liquidity</button>
	</div>
	<div class="flex justify-around mx-5 rounded bg-[#fff2] mt-5">
		<button class="liquidity_buttons"> Add </button>
		<button class="liquidity_buttons selected"> Remove </button>
	</div>
	<ProInputs />
	<div class="my-3 mx-6 allcenter flex-col text-sm text-[#fff8]">
		<span class="mt-2">Quantity: 254$ - 8000CCY</span>
		<span class="mt-2">Liquidity Share: 20%</span>
	</div>
	<div class="flex justify-center mt-auto mb-6 mx-3 text-[#1a1a1a]">
		<button class="gradientbutton p-3 rounded-3xl grow">Remove Liquidity</button>
	</div>
</div>

<style>
	.navigation_buttons {
		padding: 0 0.5rem 0.1rem 0.5rem;
		/* &.selected {
			color: #fff;
			text-decoration: underline;
			text-decoration-color:#ed32bf;
			text-decoration-thickness: 3px;
		} */
	}
	.floating {
		background-color: #1a1a1a;
		border-radius: 2rem;
		margin: 0 0.75rem;
		flex-grow: 1;
		flex-basis: 1px;
	}
	.liquidity_buttons {
		color: #fff8;
		font-size: large;
		flex: 1 0 1px;
		&.selected {
			color: white;
			background-color: #ed32bf;
			border-radius: 0.25rem;
			padding: 3px 12px;
		}
	}
	.gradientbutton {
		background: linear-gradient(to right, #ff02d1 0, #8eeafc 100%);
	}
</style>
