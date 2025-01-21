<script lang="ts">
	import ProInputs from './ProInputs.svelte';
</script>

<div class="floating flex flex-col justify-start">
	<div class="bg-black rounded-t-3xl py-3 px-5">
		<button class="navigation_buttons {'selected'}">Swap</button>
	</div>
	<ProInputs />
	<div class="flex m-1">
		<span class="text-lg ml-3 mr-auto">Slippage:</span>
		<input placeholder="Insert" />
	</div>
	<div class="flex m-1">
		<span class="text-lg ml-3 mr-auto">Deadline:</span>
		<input placeholder="Insert" />
	</div>
	<div class="my-3 mx-6 flex-col">
		<div class="text-sm text-[#fff8] flex justify-between">
			<span>Swap 1 CCY for 2 USDT</span>
			<span>Price Impact: 6%</span>
		</div>
		<div class="text-sm text-[#fff8] flex justify-between mt-2">
			<span>Slippage: 5</span>
			<span>Deadline: 4</span>
		</div>
	</div>
	<div class="flex justify-center mt-auto mb-6 mx-3 text-[#1a1a1a]">
		<button class="gradientbutton p-3 rounded-3xl grow">Swap</button>
	</div>
</div>

<style>
	.navigation_buttons {
		padding: 0 0.5rem 0.1rem 0.5rem;
		&.selected {
			color: #fff;
			text-decoration: underline;
			text-decoration-color: #ed32bf;
			text-decoration-thickness: 3px;
		}
	}
	.floating {
		background-color: #1a1a1a;
		border-radius: 2rem;
		margin: 0 0.75rem;
		flex-grow: 1;
		flex-basis: 1px;
	}
	input {
		all: unset;
		margin-right: 12px;
		border: solid 1px #ed32bf;
		border-radius: 1rem;
		width: 5em;
		&::placeholder {
			text-align: center;
			font-size: medium;
			font-weight: 300;
			color: #fff8;
		}
	}
	.gradientbutton {
		background: linear-gradient(to right, #ff02d1 0, #8eeafc 100%);
	}
</style>
