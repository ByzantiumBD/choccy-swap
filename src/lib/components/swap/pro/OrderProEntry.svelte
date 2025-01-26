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
	let innerWidth = $state(500);
	let smallScreen = $derived(innerWidth < 481);

	function createTooltip(order: OrderInfo) {
		return {
			num: order.tooltip.one,
			num2: order.tooltip.two
		};
	}

	function showText() {
		const mustShow = /[<>]/.test(order.priceRange);
		return !smallScreen || mustShow;
	}
</script>

<svelte:window bind:innerWidth />

<div style:width={smallScreen ? "1em":"2.75em"} class="section relative h-[100px] text-[#fff8] text-sm">
    <div class="tvl w-full text-center">
        {order.volume} {order.symbol}
    </div>
    <span class="range">
        {showText() ? order.priceRange : ""}
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
        style="height: {order.width || 3}%;"
        class={['bar', sell && "sell", loading && "loading"]}>
    </div>
</div>

<style lang="less">
	.bar {
		background-color: #8eeafc50;
		position: absolute;
		left: 0;
        bottom: 0;
        width: 100%;
        z-index: -1;
		&.sell {
			background-color: #ed32bf50;
		}
		&.loading {
			background-color: #fff2 !important;
		}
	}
	@media (max-width: 480px) {
		.range {
			left: -50% !important;
		}
	}
	.range{
        position: absolute;
        top: 110%;
        left: 0;
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
    .section {
        display: flex;
        align-items: flex-end;
        & > .tvl {
            display: none;
        }
        &:hover > .tvl {
            display: block;
        }
    }
</style>
