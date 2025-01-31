<script lang="ts">
	import type { OrderInfo } from "$lib/states/shared/types";
	import ReadablePrice from "../common/readablePrice.svelte";

    type Props = {
        order: OrderInfo | undefined,
        sell: boolean,
        loading: boolean,
    }

	let { order, sell, loading }: Props = $props();
    let ttData = $derived(createTooltip(order))

    function createTooltip(order: OrderInfo | undefined ) {
        const tt = order?.tooltip;
        if (!tt) return undefined;
        return {
            num: tt.one,
            num2: tt.two
        }
    }
</script>

<div
	style="--width:{order?.width ?? 0}%;--color:{!sell ? '#9dfff988' : '#c54b8c88'};--right:{sell
		? '0'
		: ''};--left:{sell ? '' : '0'};"
	class="{loading ? 'text-[var(--transparent)]' : ''} orders {sell
		? ''
		: 'flex-row-reverse'} flex items-center justify-around text-lg py-4"
>
	<span class="O"> {order?.number ?? '...'} </span>
	<span class="V">
		{order? order.volume +" "+ order.symbol : '...'}
	</span>
	<span class="P" style="--price:'{order?.tooltip??""}';">
        {order?.priceRange ?? '...'}
        {#if ttData}
            <span class="tooltip">
                <ReadablePrice {...ttData.num} />
                {" ~ "}
                <ReadablePrice {...ttData.num2} />
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