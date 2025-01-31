<script lang="ts">
	import CloseSvg from '$lib/images/swap/close.svelte';
	import { swapData } from '$lib/states/swap/swap-states.svelte';
	import { getSettingsManager } from '../common/inputManager.svelte';

	let { close, isHidden } = $props();

	let { slippage, deadline } = getSettingsManager();
	let slippageText = $state(swapData.settings.slippage.toString());
	let deadlineText = $state(swapData.settings.deadline.toString());

	function onSlippageInput(e: Event & { currentTarget: EventTarget & HTMLInputElement; }) {
		slippageText = slippage.oninput(e.currentTarget.value);
		e.currentTarget.value = slippageText;
	}

	function selectSlippage(value: number) {
		slippage.select(value);
	}

	function onDeadlineInput(e: Event & { currentTarget: EventTarget & HTMLInputElement; }) {
		deadlineText = deadline.oninput(e.currentTarget.value);
		e.currentTarget.value = deadlineText;
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	onclick={close}
	class=" {isHidden
		? '!hidden'
		: ''} bg-[#0008] z-10 text-white absolute top-0 left-0 w-screen h-screen allcenter"
>
	<div
		onclick={(e) => e.stopPropagation()}
		class="allcenter flex-col bg-black rounded-3xl border-[var(--border)] border mx-2"
	>
		<div class="allcenter !justify-between w-full p-5">
			<h2 class="font-extrabold text-xl">Settings</h2>
			<button onclick={close}><CloseSvg style="width:28px; height:28px; fill:#ff9ced" /></button>
		</div>

		<div class="flex flex-col w-full bg-[var(--black)] p-5 rounded-b-3xl">
			<p class="font-bold mb-3 ml-1">Slippage</p>
			<div id="slippages" class="allcenter !justify-between grid-cols-3">
				{#each [0.1, 0.5, 1, 2] as slip}
					<button
						aria-current={swapData.settings.slippage === slip}
						aria-label={""+slip}
						onclick={() => selectSlippage(slip)} class="selected">
						{slip}%
					</button>
				{/each}
				<button
					onclick={(e) => {
						selectSlippage(Number(slippageText));
						(e.currentTarget.children[0] as HTMLInputElement).focus();
					}}
					class="col-span-2"
					aria-label="Custom"
					aria-current={swapData.settings.slippage === Number(slippageText)}
				>
					<input type="text" placeholder="Custom" oninput={onSlippageInput} value={slippageText} />
				</button>
			</div>
			<div class="allcenter mr-3 mt-4">
				<p class="font-bold mb-1 ml-1 mr-auto">Deadline</p>
				<div class="border border-[var(--border)] rounded-3xl py-1 px-2">
					<input type="text" oninput={onDeadlineInput} value={deadlineText}
						style="width:{2}em;text-align:center;" class="deadline" />
				</div>
				<span class="mx-2">minutes</span>
			</div>
		</div>
	</div>
</div>

<style lang="less">
	input[type='text'] {
		all: unset;
		width: 4rem;
		&::placeholder {
			color: var(--transparent);
		}
		&:focus {
			outline: none;
		}
	}

	#slippages > button {
		padding: 0.25rem 0.8rem;
		border: solid var(--border) 1px;
		border-radius: 1rem;
		margin: 0 5px 0 5px;
		&[aria-current=true] {
			background-color: var(--mulberry);
			border: solid var(--mulberry) 1px;
		}
	}

	@media (max-width: 600px) {
		#slippages {
			display: grid !important;
			justify-items: center;
			gap: 0.5rem 0.5rem;
		}
	}
</style>
