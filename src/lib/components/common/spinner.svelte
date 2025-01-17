<script lang="ts">
	import { onMount } from "svelte";

    let seconds = $state(2)
    let dots = $derived(".".repeat(seconds%3 +1))

    onMount(() => {
        const id = setInterval(() => {
            seconds++
        }, 500)

        return () => clearInterval(id)
    })
</script>

<div class="absolute top-0 left-0 w-screen h-screen bg-[#0008] allcenter">
    <span class="text-white text-xl">Loading{dots}</span>
</div>