<script lang="ts">
import navaid from "navaid"
import Home from "./Home.svelte";
import Image from "./Image.svelte"

let current: unknown
let params: Record<string, string> | undefined

const route = navaid()

route
    .on('/', () => {
        params = undefined
        current = Home
    })
    .on('/image/:id', p => {
        params = p
        current = Image
    })

route.listen()
</script>

{#if params !== undefined}    
    <svelte:component this={current} {params} />
{:else}
    <svelte:component this={current} />
{/if}


    