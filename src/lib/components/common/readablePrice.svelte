<script lang="ts">
    type Props = {
        class?: string;
        fontSize?: number;
        smallFontSize?: number;
        val: string;
        numberOfDecimalZeros?: number;
    }

    let {
        class: myClass = "",
        fontSize = 1,
        smallFontSize = undefined,
        val,
        numberOfDecimalZeros = 0
    } : Props = $props()
</script>

<span class="flex {myClass}" style="position:relative;font-size:{fontSize}rem;">
    {#if numberOfDecimalZeros}
        <span style="margin-right:2px;">0.0</span>
        <span style="position:relative;bottom:-0.3rem;font-size:{smallFontSize?? fontSize*0.6}rem;">
            {numberOfDecimalZeros}
        </span>
        <span>{val}</span>
    {:else}
        <span >{val}</span>
    {/if}
</span>