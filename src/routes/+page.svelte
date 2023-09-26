<script>
import { onMount } from 'svelte';
import Pusher from 'pusher-js';
import { PUBLIC_PUSHER_KEY, PUBLIC_PUSHER_CHANNEL, PUBLIC_PUSHER_EVENT } from "$env/static/public";
import axios from 'axios';
//import { scavenger_store } from '../stores.js';

let pusher;
let pusher_channel;

let tag_number = 0;
let tags_tapped = [];
let tag_arg = '';

// Tag 1 - Participant Info
let name = '';
let library = '';
let email = '';

// Tag 2 - Vote
let vote = '';
let vote_success = null;
let vote_options = ['Harry Potter', 'Lord of the Rings'];

Pusher.logToConsole = true;

onMount(() => {
console.log('onMount');

    //pull from local storage
    name = localStorage.getItem('name') || '';
    library = localStorage.getItem('library') || '';
    email = localStorage.getItem('email') || '';
    let tags_tapped_string = localStorage.getItem('tags_tapped');
    tags_tapped = tags_tapped_string ? JSON.parse(tags_tapped_string) : [];
    
    vote = localStorage.getItem('vote') || '';
    let vote_success_string = localStorage.getItem('vote_success');
    vote_success = vote_success_string ? JSON.parse(vote_success_string) : '';

    let hash_array = document.location.search.replace(/^\?/,'').split('/');
    
    // set tag number
    tag_number = parseInt(atob(decodeURIComponent(hash_array[0]))) || 0;
    tag_arg = hash_array.length > 1 ? atob(decodeURIComponent(hash_array[1])) : '';

    // limit valid tag_arg values
    if(tag_number == 2) {
        let valid_args = ['Harry Potter', 'Lord of the Rings'];
        if(!valid_args.includes(tag_arg)) {
            tag_arg = '';
        }
    }

    pusher = new Pusher(PUBLIC_PUSHER_KEY, {
      cluster: 'us2'
    });

    pusher_channel = pusher.subscribe(PUBLIC_PUSHER_CHANNEL);
    pusher_channel.bind(PUBLIC_PUSHER_EVENT, function(data) {
      console.log(JSON.stringify(data));
    });
});

//console.log(localStorage.getItem('user'));

function store() {
    localStorage.setItem('name', name);
    localStorage.setItem('library', library);
    localStorage.setItem('email', email);
    localStorage.setItem('tags_tapped', JSON.stringify(tags_tapped));
    localStorage.setItem('vote', vote);
    localStorage.setItem('vote', JSON.stringify(vote_success));

    if(!tags_tapped) {
        tags_tapped = [];
    }
    tags_tapped.push(tag_number);
    tags_tapped = tags_tapped;
}

function handleSubmitFirst() {
    store();
}

function handleSubmitVote(vote) {
    /* fetch
    const response = await fetch('/vote', {
        method: 'POST',
        body: JSON.stringify({ vote: vote, email: email}),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    */
    let data = {
        vote,
        email
    };
    let data_string = JSON.stringify(data);
    axios.post('/vote', data_string)
    .then(function (response) {
        vote_success = response.data;
        store();
    })
    .catch(function (error) {
        console.log(error);
    });
}

function resetVote() {
    vote = '';
    vote_success = '';
}
</script>
Tag: {tag_number}
{#if tag_number === 0}
<p>Welcome to the Buckeye Innovation NFC demo scavenger hunt!</p>
Instructions:
<ul>
    <li>Find a Buckeye Innovation book and touch your phone to the tap zone (camera area for iPhone, center back for Android)</li>
    <li>Answer the question asked to get the next clue.</li>
    <li>Repeat for all 4 tags.</li>
    <li>Return to our booth to collect your prize.</li>
</ul>
<p>For testing only:</p>
<ol>
    {#each [1,2,3,4,5] as tag}
    <li><a href={'/?' + btoa(tag)}>Tag {tag}</a></li>
    {/each}
</ol>
{:else if tag_number === 1}
    <h1>You found the first tag!</h1>
    {#if tags_tapped.includes(1) }
        <h2>It's great to meet you, {name}!</h2>
        
        <p>You're on a journey to discover some ways NFC tags and web technology can effectively engage and serve your library staff, cardholders, donors, and more!</p>

        <p>Good luck with your scavenger hunt. We'll talk to you very soon... when you find our second tag.</p>
    {:else}
        <p>Would you share with us a little about yourself?</p>
        <p><input type="text" bind:value={name} placeholder="Your First Name" /></p>
        <p><input type="text" bind:value={library} placeholder="Your Library / Organization" /></p>
        <p><input type="email" bind:value={email} placeholder="Your Email Address" /></p>
        <button on:click={handleSubmitFirst}>Submit</button>
    {/if}
{:else if tag_number == 2}
    {#if !vote_success}
    <p>Welcome back, {name}! Which of the following do you think is the best book series? Click one to vote.</p>
    {#each vote_options as option}
    <p><button on:click={() => handleSubmitVote(option)}>{option}</button></p>
    {/each}
    {:else}
    <p>Your vote has been cast for {tag_arg}! Visit the Buckeye Innovation booth to see the current vote tally.</p>
    <p><button on:click={resetVote}>Change my vote</button></p>
    {/if}
{:else if tag_number == 3}
    This is the third tag: Girls Who Code
{:else if tag_number == 4}
    This is the fourth tag: COSI
{:else if tag_number == 5}
    This is the fifth tag: PLA
{/if}

<!--
PLA Raffle Entry:
https://bit.ly/PLAOLC23
-->
