<script lang="ts">
	import { shortenNumber } from "$lib/number-utils";
	import type { ReadablePriceType } from "$lib/types";
	import type { Amount } from "@chromia/ft4";
	import ReadablePrice from "../common/readablePrice.svelte";

	type OrderInfo = {
		number: string;
		volume: Amount;
		symbol: string;
		priceRange: string;
		width: number;
		tooltip: TooltipData;
	};

	type TooltipData = {
		one: ReadablePriceType | undefined,
		two: ReadablePriceType | undefined,
	}

    type Props = {
        order: OrderInfo | undefined,
        sell: boolean,
        loading: boolean,
        tooltip?: string,
    }

	let { order, sell, loading }: Props = $props();
    let ttData = $derived(createTooltip(order))

    function createTooltip(order: OrderInfo | undefined ) {
        const tt = order?.tooltip;
        if (!tt) return undefined;
        if (tt.one === undefined) {
            return {
                num: tt.two!,
                prefix: "< ",
            }
        } else if (tt.two === undefined) {
            return {
                num: tt.one,
                prefix: "> ",
            }
        } else {
            return {
                num: tt.one,
                num2: tt.two,
                prefix: undefined,
            }
        }
    }
</script>

<div
	style="--width:{order?.width ?? 0}%;--color:{sell ? '#8eeafc88' : '#ed32bf88'};--right:{sell
		? '0'
		: ''};--left:{sell ? '' : '0'};"
	class="{loading ? 'text-[#fff8]' : ''} orders {sell
		? ''
		: 'flex-row-reverse'} flex items-center justify-around text-lg py-4"
>
	<span class="O"> {order?.number ?? '...'} </span>
	<span class="V">
		{order ? shortenNumber(order.volume.toString()) + order.symbol : '...'}
	</span>
	<span class="P" style="--price:'{order?.tooltip??""}';">
        {order?.priceRange ?? '...'}
        {#if ttData}
            <span class="tooltip">
                {ttData.prefix}
                <ReadablePrice {...ttData.num} />
                {#if ttData.num2}
                    {" ~ "}
                    <ReadablePrice {...ttData.num2} />
                {/if}
            </span>
        {/if}
    </span>
</div>

<style lang="less">
    .P{
        position: relative;
        & .tooltip {
            display: none;
        }
        &:hover .tooltip {
            content: var(--price);
            display: flex;
            padding: 0.5rem;
            position: absolute;
            z-index: 2;
            top: -0.5rem;
            left: 110%;
            color: white;
            background-color: black;
            border-radius: 4px;
        }
    }

	.orders:hover {
		background-color: #0004;
	}
	.orders {
		--width: 50%;
		position: relative;
		&::before {
			transition: all 0.25s ease;
			z-index: -1;
			position: absolute;
			right: var(--right);
			left: var(--left);
			background-color: var(--color);
			width: var(--width);
			top: 0;
			height: 100%;
			content: '';
		}
	}

	@media (max-width: 600px) {
		.O {
			display: none;
		}
	}
</style>