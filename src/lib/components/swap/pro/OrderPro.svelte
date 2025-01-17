<script lang="ts">
</script>

<div class="rounded-3xl grow flex flex-col bg-[#10101099] boxblur">
	<h2 class="px-5 py-3 text-2xl font-bold bg-black rounded-t-3xl">OrderBook</h2>
	<div class="allcenter flex-col text-xl">
		<div class="flex flex-row w-full">
			<div class="p-3 border-r border-[#fff8] flex justify-center grow flex-1">
				<span class="underline decoration-[#8eeafc] decoration-2 underline-offset-2">Selling</span>
			</div>
			<div class="p-3 flex justify-center grow flex-1">
				<span class="underline decoration-[#ed32bf] decoration-2 underline-offset-2">Buying</span>
			</div>
		</div>
		<div class="w-full flex border-t border-[#fff8] text-base">
			<div class="border-r border-[#fff8] grow flex justify-around py-2">
				<span> Price </span>
				<span> TVL </span>
				<!-- Crea Elemento Order -->
			</div>
			<div class="grow flex justify-around py-2">
				<span> TVL </span>
				<span> Price </span>
				<!-- Crea Elemento Order -->
			</div>
		</div>
	</div>
</div>

<style>
	.boxblur {
		backdrop-filter: blur(15px);
	}
</style>
