<script>
	import { onMount } from 'svelte';
    import Taglist from '../components/Taglist.svelte';
    import '../css/style.css';

    let tags_tapped = [];

    onMount(() => {
        let tags_tapped_string = localStorage.getItem('tags_tapped');
        tags_tapped = tags_tapped_string ? JSON.parse(tags_tapped_string) : [];
    });
</script>

<main>
    <Taglist tags={tags_tapped}></Taglist>

    <slot />
</main>