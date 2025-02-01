<script lang="ts">
	import logo from '$lib/images/common/xchoccy_wt_top.svg';
	import menu from '$lib/images/common/menu.svg';
	import HeaderContent from './headerContent.svelte';

	let { isSwap } = $props();
	let menuOpen = $state(false);
	let clickOutside: HTMLDivElement;

	function setMenu(open: boolean) {
		menuOpen = open;
	}

	function onclick(e: MouseEvent) {
		if (e.target && clickOutside && !clickOutside.contains(e.target as Node)) {
			setMenu(false);
		}
	}
</script>

<svelte:document {onclick} />

<div id="positioner" class="absolute w-full z-10">
	<div id="header" class="allcenter bg-transparent text-white py-3 px-7">
		<div id="header-content" class="allcenter max-w-[1200px] w-full">
			<a href="https://www.choc.cy/" id="brand" class="allcenter">
				<img src={logo} alt="logo" class="h-[50px]" />
			</a>
			<div class="max-[779px]:hidden allcenter ml-auto">
				<HeaderContent {isSwap} close={() => setMenu(false)} />
			</div>

			<div class="min-[780px]:hidden ml-auto relative">
				<div id="click-outside" bind:this={clickOutside}>
					<button onclick={() => setMenu(!menuOpen)}>
						<img src={menu} alt="menu" class="text-white" />
					</button>

					<div
						id="topbarmenu"
						class={[
							'min-[780px]:!hidden absolute top-full right-0 p-3 gap-3 w-[500%]',
							{ open: menuOpen }
						]}
					>
						<HeaderContent {isSwap} close={() => setMenu(false)} />
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="less">
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

	:global(body) {
		font-family: Roboto, sans-serif;
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
			background-color: #c54b8c22;
			border-radius: 5mm;
			backdrop-filter: blur(5.538px);
		}
	}
</style>
