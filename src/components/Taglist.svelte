<script>
    export let tags;
</script>
<style>
    ul {
        display: flex;
        margin: 0 0 10px;
        padding: 0;
    }
    li {
        list-style: none none;
        flex: 1;
        text-align: center;
        padding: 5px 0;
        border: 1px solid #ddd;
    }
    li:first-child {
        border-radius: 10px 0 0 10px;
    }
    li:last-child {
        border-radius: 0 10px 10px 0;
    }
    .tapped {
        background: #eee;
        color: #ccc;
    }
    .progress-heading {
        text-align: center;
        margin: 0;
        font-weight: normal;
        color: #666;
        font-size: .9em;
    }
    .winner {
        text-align: center;
    }
</style>

<h5 class="progress-heading">Tags left to find</h5>
<ul>
{#each [1,2,3,4,5,6,7,8] as tag}
<li class={tags.includes(tag) ? 'tapped':''}>{tag}</li>
{/each}
</ul>
{#if tags.length >= 5}
<div class="winner">You've found {tags.length} tags, so you're a winner! Head back to the Buckeye Innovation booth to collect your prize!</div>
{/if}