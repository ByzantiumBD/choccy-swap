<script lang="ts">
	import logo from '$lib/images/common/logo.svg';
	import writing from '$lib/images/common/writing.svg';
	import menu from '$lib/images/common/menu.svg';
	import Walletconnector from '../swap/common/walletconnector.svelte';
	import Animatedarrow from '../swap/pro/animatedarrow.svelte';
	import { isProMode } from '$lib/states/swap/swap-states.svelte';

	let { isSwap } = $props();
	let menuDiv: HTMLDivElement;

	function toggleMenu() {
		if (menuDiv.classList.contains('open')) menuDiv.classList.remove('open');
		else menuDiv.classList.add('open');
	}

	function changeProMode() {
		isProMode.value = !isProMode.value;
	}
</script>

<div id="positioner" class="absolute w-full z-10">
	<div id="header" class="allcenter bg-transparent text-white py-3 px-7">
		<div id="header-content" class="allcenter max-w-[1200px] w-full">
			<a href="/" id="brand" class="allcenter">
				<img src={logo} alt="logo" class="h-[50px]" />
				<img src={writing} alt="choccyswap" class="h-[30px] px-3" />
			</a>
			<div class="max-[779px]:hidden allcenter ml-auto">
				<div id="links" class="allcenter ml-auto mr-8 space-x-8 font-medium">
					<a href="/pools" class=""> Pools </a>
				</div>
				{#if isSwap}
					<button onclick={changeProMode} class="{isProMode.value? "clicked":""} promode mr-5 clickable font-semibold">
						PRO Mode
						<Animatedarrow isClicked={isProMode.value}/>
					</button>
					<Walletconnector />
				{:else}
					<a href="/swap" class="clickable pinkbutton py-1.5 px-7 font-semibold "> Swap Now </a>
				{/if}
			</div>

			<div class="min-[780px]:hidden ml-auto relative">
				<button onclick={toggleMenu}>
					<img src={menu} alt="menu" class="text-white" />
				</button>

				<div
					bind:this={menuDiv}
					id="topbarmenu"
					class="min-[780px]:!hidden absolute top-full right-0 p-3 gap-3 w-[500%]"
				>
					<a href="/pools" class=""> Pools </a>
					{#if isSwap}
						<button onclick={changeProMode} class="{isProMode.value? "clicked":""} promode clickable font-semibold">
							PRO Mode
							<Animatedarrow isClicked={isProMode.value}/>
						</button>
						<Walletconnector />
					{:else}
						<a href="/swap" class="pinkbutton py-1.5 px-7 font-semibold"> Swap Now </a>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="less">
	.pinkbutton:hover {
		border: 2.34px solid #b5178e !important;
	}

	.pinkbutton {
		background: linear-gradient(276.31deg, #ed32bf -10.17%, #b5178e 97.19%);
		border-radius: 32px;
		backdrop-filter: blur(5.538px);
		border: 2.34px solid #b5178e;

		&:hover {
			border: 2.34px solid rgba(255, 255, 255, 0.326);
		}
	}

	#header::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		backdrop-filter: blur(5.538px);
	}

	#topbarmenu {
		display: none;

		&::before {
			content: '';
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: -1;
			background-color: #ed32bf22;
			border-radius: 5mm;
			backdrop-filter: blur(5.538px);
		}
	}

	:global(body) {
		font-family: Roboto, sans-serif;
	}

	.promode {
		border-radius: 32px;
		border: 2.34px solid #ed32bf;
		padding: 0.375rem 1.5rem;
		display: flex;
		&.clicked {
			padding: 0.375rem 1.25rem;
		}
	}
</style>
