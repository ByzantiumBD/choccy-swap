<script lang="ts">
	import type { OrderInfo } from '$lib/states/shared/types';
	import ReadablePrice from '$lib/components/common/readablePrice.svelte';

	type Props = {
		order: OrderInfo;
		sell?: boolean;
		loading: boolean;
	};

	let { order, sell = false, loading }: Props = $props();
	let ttData = $derived(createTooltip(order));

	function createTooltip(order: OrderInfo) {
		return {
			num: order.tooltip.one,
			num2: order.tooltip.two
		};
	}
</script>

<div class="relative mt-1 p-0.5 flex self-stretch {sell? "justify-end":"justify-start flex-row-reverse"}">
    <span class="text-[#fff8] text-sm {sell? "mr-auto":"ml-auto"}">
        {order.volume} {order.symbol}
    </span>
    <span class="range text-[#fff8] text-sm relative">
        {order.priceRange}
        <span style="{sell?"right":"left"}:150%;" class="tooltip">
            {#if ttData.num.val === "..."}
                <span>select a pair</span>
            {:else}
                <ReadablePrice {...ttData.num} />
                {" ~ "}
                <ReadablePrice {...ttData.num2} />
            {/if}
        </span>
    </span>
    <div
        style="width: {order.width || 50}%;"
        class={['bar', sell && "sell", (loading || order.width===0) && "loading"]}>
    </div>
</div>

<style lang="less">
	.bar {
		background-color: #8eeafc;
		position: absolute;
		left: 0;
        top: 0;
        height: 100%;
        z-index: -1;
		&.sell {
			background-color: #ed32bf;
			left: unset;
			right: 0;
		}
		&.loading {
			background-color: #fff2 !important;
		}
	}
	.range{
	    & .tooltip {
	        display: none;
	        padding: 0.5rem;
	        position: absolute;
	        z-index: 2;
	        top: -0.5rem;
	        color: white;
	        background-color: black;
	        border-radius: 4px;
	    }
	    &:hover .tooltip {
	        display: flex;
	    }
	}

	// .orders:hover {
	// 	background-color: #0004;
	// }
	// .orders {
	// 	--width: 50%;
	// 	position: relative;
	// 	&::before {
	// 		transition: all 0.25s ease;
	// 		z-index: -1;
	// 		position: absolute;
	// 		right: var(--right);
	// 		left: var(--left);
	// 		background-color: var(--color);
	// 		width: var(--width);
	// 		top: 0;
	// 		height: 100%;
	// 		content: '';
	// 	}
	// }

	// @media (max-width: 600px) {
	// 	.O {
	// 		display: none;
	// 	}
	// }
</style>
