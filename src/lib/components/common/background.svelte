<script lang="ts">
    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();
</script>


<div id="black" class="w-full bg-black h-auto grow flex">
    <div id="container" class="allcenter grow">
        <div class="max-w-[1200px] grow self-stretch z-[2] allcenter flex-col">
            {@render children?.()} 
        </div>
    </div>
</div>

<style lang="less">
    #container:before {
        background-image: url("$lib/images/common/bg.svg");
        background-size: 50cm;
        opacity: 0.9;
        background-position: center;

        content: '';
        position: absolute;
        left: 0; top: 0;
        width: 100%; height: 100%;
        z-index: 1;
        mask-image:
            radial-gradient(ellipse 20cm 40cm at 50% 20cm, #0000 0%, #0000 10%, #000f 100%);
    }
</style>