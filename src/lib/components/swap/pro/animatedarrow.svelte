<script lang="ts">
    let { isClicked }: { isClicked: boolean } = $props()
</script>


<svg
  focusable="false"
  aria-hidden="true"
  viewBox="0 0 10 10"
  version="1.1"
  class="w-[24px] h-[24px] p-[5px] {isClicked? "clicked" : ""}"
  xmlns="http://www.w3.org/2000/svg">
    <path style="stroke:white;fill:none;" d="m0 0 10 10"></path>
    <path style="stroke:white;fill:none;" d="m0 10 10 -10"></path>
</svg>

<style lang="less">
    svg {
        transition: all 0.25s ease;
        transform: translateX(12px);

        & > path {
            transition: all 0.25s ease;
            stroke: white;
            stroke-width: 2px;
            stroke-dasharray: 7.8;
        }
    
        &.clicked {
            transform: translateX(0);
            margin-left: 0.5rem;
    
            & > path {
                stroke-dasharray: 14.14;
            }
        }
    }
</style>