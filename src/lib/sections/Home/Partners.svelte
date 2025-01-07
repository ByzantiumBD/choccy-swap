<script lang="ts">
	import mna from '$lib/images/home/My-Neighbor-Alice_Logo.png';
	import Cwlogo from '$lib/images/home/cwlogo.svelte';
	import Cwtext from '$lib/images/home/cwtext.svelte';
	import chromia from '$lib/images/home/logo-chromia.svg';
</script>

<div id="Partners" class="allcenter flex-col mt-[100px]">
	<h2 id="gradient-title" class="text-3xl p-[20px] text-center">Our Ecosystem Partners</h2>
	<div class="allcenter min-[707px]:space-x-10 max-[706px]:flex-col">
		<a href="https://www.myneighboralice.com/"
			><img src={mna} class="w-[150px]" alt="my neighbor alice logo" />
		</a>
		<a class="cw flex" href="https://chromaway.com/">
			<Cwlogo />
			<Cwtext />
		</a>
		<a href="https://chromia.com/"><img src={chromia} class="w-[150px]" alt="chromia logo" /></a>
	</div>
</div>

<style>
	#gradient-title {
		background: linear-gradient(90.87deg, #ff02d1 -11.18%, #8eeafc 108.08%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	img {
		filter: grayscale(1);
		transition: all 0.5s;

		&:hover {
			filter: none;
		}
	}

	.cw {
		color: #ccc;
		width: 300px;
		transition: all 0.5s;

		&:hover {
			color: white;
		}
	}
</style>
