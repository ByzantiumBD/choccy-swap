<script lang="ts">
	let completed: HTMLButtonElement | undefined = $state(),
		progress: HTMLButtonElement | undefined = $state(),
		scheduled: HTMLButtonElement | undefined = $state(),
		planned: HTMLButtonElement | undefined = $state();
	let scroller: HTMLDivElement | undefined = $state();
	let cW: number = $state(0),
		prW: number = $state(0),
		sW: number = $state(0),
		plW: number = $state(0);

	$effect(() => {
		let selected = 0;
		const buttons = [completed, progress, scheduled, planned];

		buttons.forEach((b, i) => {
			b?.addEventListener('click', () => {
				buttons[selected]?.classList.remove('selected');
				selected = i;
				buttons[selected]?.classList.add('selected');
				const widths = [cW, prW, sW, plW];
				const offset = widths.reduce((sum, v, idx) => {
					if (idx < i) return sum + v;
					return sum;
				}, 0);
				scroller?.scrollTo({
					left: offset,
					behavior: 'smooth'
				});
			});
		});
	});
</script>

<div id="Roadmap" class="max-[1200px]:!hidden allcenter mt-[150px] flex-col text-white mb-[250px]">
	<h1 class="mb-4 text-center text-6xl font-bold leading-relaxed">Roadmap</h1>

	<div
		bind:this={scroller}
		id="scrollbox"
		class="mt-4 w-screen max-w-[1200px] overflow-y-clip overflow-x-scroll"
	>
		<div id="alltasks" class="relative flex items-start pb-[10cm]">
			<div bind:clientWidth={cW} id="completed">
				<div>
					<span class="floating-span left-0 w-1/4" style:--offset="0.7cm">
						<h3 class="text-xl font-extrabold text-[#ED32BF]">First version release</h3>
						<p class="text-sm opacity-70">
							Introduce the application publicly and invite early adopters to explore and test its
							features on a private server.
						</p>
					</span>

					<span class="floating-span left-1/4 w-1/4" style:--offset="0.5cm">
						<h3 class="text-xl font-extrabold text-[#ED32BF]">FT4 update</h3>
						<p class="text-sm opacity-70">
							Improve the dapp experience by integrating it with the newest version of FT protocol,
							ensuring performance and compatibility with Chromia's latest advancements.
						</p>
					</span>

					<span class="floating-span left-1/2 w-1/4" style:--offset="2.8cm">
						<h3 class="text-xl font-extrabold text-[#ED32BF]">Website & branding update</h3>
						<p class="text-sm opacity-70">
							Refreshed website with our new branding, setting the stage for the debut of our
							project on mainnet.
						</p>
					</span>

					<span class="floating-span left-3/4 w-1/4" style:--offset="0.2cm">
						<h3 class="text-xl font-extrabold text-[#ED32BF]">Liquidity Deals</h3>
						<p class="text-sm opacity-70">
							Strategic partnerships and collaborations with important players in the space to boost
							liquidity for the swap platform at launch, clearing the path for seamless trading.
						</p>
					</span>
				</div>
			</div>

			<div bind:clientWidth={prW} id="in-progress">
				<div>
					<span class="floating-span left-0 w-1/4" style:--offset="3.4cm">
						<h3 class="text-xl font-extrabold text-[#ED32BF]">Orderbook implementation</h3>
						<p class="text-sm opacity-70">
							Add an orderbook to the AMM swap platform to expand its functionality, letting users
							make precise trades within asset pairs.
						</p>
					</span>

					<span class="floating-span left-1/4 w-1/4" style:--offset="3cm">
						<h3 class="text-xl font-extrabold text-[#ED32BF]">Performance test</h3>
						<p class="text-sm opacity-70">
							Thoroughly test the orderbook feature to confirm the feasibility of a hybrid exchange
							model, combining the best of automated pools and orderbook trading.
						</p>
					</span>

					<span class="floating-span left-1/2 w-1/4" style:--offset="0.6cm">
						<h3 class="text-xl font-extrabold text-[#ED32BF]">User onboarding</h3>
						<p class="text-sm opacity-70">
							Engaging promotional push across our social accounts to capture audiences attention
							and foster community growth.
						</p>
					</span>

					<span class="floating-span left-3/4 w-1/4" style:--offset="0.6cm">
						<h3 class="text-xl font-extrabold text-[#ED32BF]">Launchpad implementation</h3>
						<p class="text-sm opacity-70">
							Build a launchpad on Choccy's platform, allowing developers to launch tokens, projects
							and initial offerings with semplicity and ease.
						</p>
					</span>
				</div>
			</div>

			<div bind:clientWidth={sW} id="scheduled">
				<div>
					<span class="floating-span left-0 w-1/2" style:--offset="1cm">
						<h3 class="text-xl font-extrabold text-[#ED32BF]">Liquidity provision</h3>
						<p class="text-sm opacity-70">
							Establishing liquidity pools linked to tokens from key ecosystem players to strenghten
							the platform's foundation and create a diverse trading environment that reflects the
							collective strength of the Chromia ecosystem.
						</p>
					</span>

					<span class="floating-span left-1/2 w-1/2" style:--offset="3.4cm">
						<h3 class="text-xl font-extrabold text-[#ED32BF]">Subscription model</h3>
						<p class="text-sm opacity-70">
							Allowing token holders more flexibility with access to lower trading fees on our
							platform. By offering lower trading fees to token holders, we aim to incentivize
							participation and demonstrate the pratical utility of the token both for transactions
							as well as participation in the growing services across our ecosystem. Our aspiration
							is for CCY to emerge as a valuable digital asset that customers will see long-term
							value in holding.
						</p>
					</span>
				</div>
			</div>

			<div bind:clientWidth={plW} id="planned">
				<div>
					<span class="floating-span left-0 w-1/3" style:--offset="0cm">
						<h3 class="text-xl font-extrabold text-[#ED32BF]">Metamask integration</h3>
						<p class="text-sm opacity-70">
							Utilizing Metamask Snaps to simplify the user experience and seamlessly integrate with
							the Chromia network. This will make it easier for users to navigate and engage with
							the platform, creating a more intuitive and frictionless experience overall.
						</p>
					</span>

					<span class="floating-span left-1/3 w-1/3" style:--offset="2.8cm">
						<h3 class="text-xl font-extrabold text-[#ED32BF]">Oracles</h3>
						<p class="text-sm opacity-70">
							Integrating oracle solutions and price feeds to provide accurate and reliable data for
							other chains within the Chromia network and beyond. This will enhance interoperability
							and facilitate the exchange of information, creating a more interconnected ecosystem
							for all participants.
						</p>
					</span>

					<span class="floating-span left-2/3 w-1/3" style:--offset="0cm">
						<h3 class="text-xl font-extrabold text-[#ED32BF]">Sharding</h3>
						<p class="text-sm opacity-70">
							Build a dedicated environment for lower liquidity pairs, allowing high-volatility
							trades involving "meme" tokens and similar assets without disrupting the functionality
							of blue-chip tokens. This distinction ensures optimal performance and stability for
							all types of assets, adhering to diverse investment strategies and preferences.
						</p>
					</span>
				</div>
			</div>
		</div>
	</div>
	<div
		id="roadmap-navigation-buttons"
		class="allcenter mt-[60px] space-x-20 text-lg font-semibold text-[#fff8]"
	>
		<button bind:this={completed} class="roadmap-buttons selected"> Completed </button>
		<button bind:this={progress} class="roadmap-buttons"> In Progress </button>
		<button bind:this={scheduled} class="roadmap-buttons"> Scheduled </button>
		<button bind:this={planned} class="roadmap-buttons"> Planned </button>
	</div>
</div>

<style>
	#scrollbox {
		mask: linear-gradient(90deg, #0000 0, #000f 5mm, #000f calc(100% - 5mm), #0000 100%);
	}

	#alltasks {
		background-image: url('$lib/images/home/Roadmap.svg');
		width: 130cm;
		background-repeat: repeat-x;
		background-position-y: bottom;
		& > div {
			display: flex;
			width: 100%;
			max-width: 1200px;
			padding: 0 5rem;
			& > div {
				width: 100%;
				position: relative;
			}
		}
	}

	.roadmap-buttons {
		padding: 0 0.5rem 0.1rem 0.5rem;
		&.selected {
			color: #fff;
			border-bottom: solid #ed32bf 3px;
		}
	}

	.floating-span {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: start;
		padding: 0 1rem;
		top: 0;
		&::before {
			content: '';
			background-color: white;
			width: 1px;
			height: calc(5cm + var(--offset));
			position: absolute;
			left: 2mm;
			top: 0.5rem;
		}
	}
</style>
