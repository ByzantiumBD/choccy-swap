<script lang="ts">
	import ProInputs from './ProInputs.svelte';
</script>

<div class="floating flex flex-col justify-start">
	<div class="bg-black rounded-t-3xl py-3 px-5">
		<button class="navigation_buttons">Orders</button>
	</div>
	<ProInputs />
	<div class="my-3 mx-6 flex-col">
		<div class="text-sm text-[#fff8] flex justify-between">
			<span>Current Price: 7$</span>
			<span>Order Price: 16$</span>
		</div>
		<div class="text-sm text-[#fff8] flex justify-between mt-2">
			<span>Order: 30 CCY for 69 USDT</span>
		</div>
	</div>
	<div class="flex justify-center mt-auto mb-6 mx-3 text-[#1a1a1a]">
		<button class="gradientbutton p-3 rounded-3xl grow">Put Order</button>
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
	.gradientbutton {
		background: linear-gradient(to right, #ff02d1 0, #8eeafc 100%);
	}
</style>
