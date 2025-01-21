<script lang="ts">
</script>

<div class="bg-[#ed32bf55] border-2 border-[#ed32bf88] rounded-2xl mx-3 mt-5 flex p-3">
	<div class="flex-[2_0_1px] flex flex-col">
		<span class="text-base">Token 1</span>
		<input placeholder="0.00" />
	</div>
	<div class="flex-[1_0_1px] flex flex-col items-end justify-center">
		<span class="text-base text-[#fff8]">Balance: 0</span>
		<span class="text-base text-[#fff8]">0.00$</span>
	</div>
</div>
<div class="bg-[#ed32bf55] border-2 border-[#ed32bf88] rounded-2xl m-3 flex p-3">
	<div class="flex-[2_0_1px] flex flex-col">
		<span class="text-base">Token 2</span>
		<input placeholder="0.00" />
	</div>
	<div class="flex-[1_0_1px] flex flex-col items-end justify-center">
		<span class="text-base text-[#fff8]">Balance: 0</span>
		<span class="text-base text-[#fff8]">0.00$</span>
	</div>
</div>

<style>
	input {
		all: unset;
		font-size: xx-large;
		width: 100%;
		&::placeholder {
			color: #fff8;
		}
	}
</style>
