<script>
    export let tags;

</script>
<style>
    ul {
        display: flex;
    }
    li {
        list-style: none none;
        flex: 1;
        text-align: center;
    }
    .tapped {
        background: #ddd;
    }
</style>

<ul>
<li>Progress:</li>
{#each [1,2,3,4,5] as tag}
<li class={tags.includes(tag) ? 'tapped':''}>{tag}</li>
{/each}
</ul>
{#if tags.length == 5}
<strong>You've found all the tags! Head on back to the Buckeye Innovation booth to collect your prize!</strong>
{/if}