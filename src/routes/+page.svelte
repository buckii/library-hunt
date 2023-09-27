<script>
import { onMount } from 'svelte';
import Pusher from 'pusher-js';
import { PUBLIC_PUSHER_KEY, PUBLIC_PUSHER_CHANNEL, PUBLIC_PUSHER_EVENT } from "$env/static/public";
import axios from 'axios';

let pusher;
let pusher_channel;

let tag_number = null;
let tags_tapped = [];
let tag_arg = '';
let cta_success = [];
let testing = false;
const tags = [
    null,
    {
        hint: '',
    },
    {
        name: 'Girls Who Code',
        hint: 'We love hiring apprentices and internships. Equitable access to technology and design depends on <strong>Girls Who Code</strong>.',
        text: 'Before you go, sign up for the Girls Who Code email list by clicking below.',
        cta_img: '',
        cta_text: 'Visit Girls Who Code online',
        cta_url: 'https://girlswhocode.com/',
    },
    {
        name: 'PLA',
        hint: 'You can look around the world to find an ally for these public library staff members... that\'s a large Public Library Association!',
        text: 'You should attend the Public Library Association 2024 Conference April 3-5, 2024 at the Greater Columbus Convention Center.',
        cta_img: '',
        cta_text: 'Register for the PLA raffle',
        cta_url: 'https://bit.ly/PLAOLC23',
    },
    {
        name: 'SHP',
        text: '',
        hint: 'Cincinnati\'s largest architectural firm that is <strong><u>S</u></strong>imply <strong><u>H</u></strong>elping <strong></u>P</u></strong>eople with access to a team of dynamic architects, designers, and engineers.',
        cta_img: '',
        cta_text: 'Visit SHP online',
        cta_url: 'https://shp.com',
    },
    {
        name: 'OPLIN',
        text: '',
        hint: 'Is this a simulation or reality? With fast and free internet speeds, we\'re an Information Network that keeps our Ohio Public Libraries connected.',
        cta_img: '',
        cta_text: 'Visit OPLIN online',
        cta_url: 'https://www.oplin.ohio.gov',
    },
    {
        name: 'CBLH Design',
        text: '',
        hint: 'Tired feet? This ar<strong><u>C</u></strong>hitecture, planning, and interior design firm would happily share their big <strong><u>BL</u></strong>ue couc<strong><u>H</u></strong> and ottoman with you!',
        cta_img: '',
        cta_text: 'Visit CBLH Design online',
        cta_url: 'https://cblhdesign.com',
    },
    {
        name: 'Historic Voices',
        text: '',
        hint: 'Our Historic Voices are not lost and will not only lead you to your next hint, but to an online database to hear our historical spoken words.',
        cta_img: '',
        cta_text: 'Visit Historic Voices online',
        cta_url: 'http://www.historicalvoices.org',
    },
    {
        name: 'COSI',
        text: 'Kids across the state had extra support this summer thanks to a partnership between COSI an OLC. Visit their booth to talk about how your library can participate in the future.',
        hint: 'To learn about the center of the universe, you\'ll need to head to the Center of Science and Industry.',
        cta_img: '',
        cta_text: 'Check out what COSI has going on',
        cta_url: 'https://photos.google.com/share/AF1QipNm8a3s-hy1gVecJQwb5ykFj7ZJVVOe4GQ_aGJbuk2unZUFjkQ7IiWEochdMcN8fg?key=SnVvT2RSNmdza2hQVEdrYU4yQUM0bnc1VXVpQk9R'
    },

]

// Tag 1 - Participant Info
let name = '';
let library = '';
let email = '';

// Tag 2 - Vote
let vote = '';
let vote_options = ['Harry Potter', 'Lord of the Rings'];

let girls_who_code_saved = false;

Pusher.logToConsole = true;

onMount(() => {
console.log('onMount');

    //pull from local storage
    testing = localStorage.getItem('testing') || false;
    name = localStorage.getItem('name') || '';
    library = localStorage.getItem('library') || '';
    email = localStorage.getItem('email') || '';
    let tags_tapped_string = localStorage.getItem('tags_tapped');
    tags_tapped = tags_tapped_string ? JSON.parse(tags_tapped_string) : [];

    console.log(['tapped',tags_tapped]);
    
    vote = localStorage.getItem('vote') || '';
    let cta_success_string = localStorage.getItem('cta_success');
    cta_success = cta_success_string ? JSON.parse(cta_success_string) : [];

    let hash_array = document.location.search.replace(/^\?/,'').split('/');

    // testing mode when #test is in the URL
    testing = document.location.hash.match(/^#test/) || testing;
    if(document.location.hash.match(/^#notest/)) testing = false;
    
    // set tag number
    tag_number = parseInt(atob(decodeURIComponent(hash_array[0]))) || 0;
    tag_arg = hash_array.length > 1 ? atob(decodeURIComponent(hash_array[1])) : '';

    // limit valid tag_arg values
    if(tag_number == 2) {
        if(!vote_options.includes(tag_arg)) {
            tag_arg = '';
        }
    }

    if(tag_number > 1) {
        store();
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
    localStorage.setItem('testing', testing);
    localStorage.setItem('name', name);
    localStorage.setItem('library', library);
    localStorage.setItem('email', email);
    localStorage.setItem('vote', vote);
    localStorage.setItem('cta_success', JSON.stringify(cta_success));

    if(!tags_tapped) {
        tags_tapped = [];
    }
    if(tag_number > 2) {
        tags_tapped.push(tag_number);
    }
    tags_tapped = tags_tapped;
    localStorage.setItem('tags_tapped', JSON.stringify(tags_tapped));

    let data = {
        name,
        library,
        email,
        vote,
        cta_success,
        tags_tapped
    };
    //let data_string = JSON.stringify(data);
    axios.post('/user', data)
    .then(function (response) {
        console.log('saved successfully');
        if(!tags_tapped.includes(tag_number) && tag_number > 0) {
            tags_tapped.push(tag_number);
        }
    })
    .catch(function (error) {
        console.log(error);
    });
}

function resetTagsTapped() {
    tags_tapped = [];
    name = '';
    email = '';
    library = '';
    vote = '';
    cta_success = [];
    store();
}

function handleSubmitFirst() {
    store();
}

function handleSubmitVote(vote_val) {
    /* fetch
    const response = await fetch('/vote', {
        method: 'POST',
        body: JSON.stringify({ vote: vote, email: email}),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    */
    vote = vote_val;
    let data = {
        vote,
        email
    };
    let data_string = JSON.stringify(data);
    axios.post('/vote', data_string)
    .then(function (response) {
        if(!cta_success.includes(2)) {
            cta_success.push(2);
            cta_success = cta_success;
        }
        store();
    })
    .catch(function (error) {
        console.log(error);
    });
}

function handleSubmitGirlsWhoCode() {
    let url = 'https://girlswhocode.com/addcontact';
    let data = {
        "EmailAddress": email,
        "IsStudent": false
    };
    axios.post(url, data)
        .then((response) => {
            girls_who_code_saved = true;
        })
        .catch(err => console.log(err));
}

function resetVote() {
    vote = '';
    if(cta_success.includes(2)) {
        cta_success = cta_success.filter(i => i != 2);
    }
    store();
}
</script>
{#if tag_number === 0}
<p>Welcome to the Buckeye Innovation NFC demo scavenger hunt!</p>
<div style="text-align: left">
<h3 class="hint">Instructions:</h3>
<div class="hint-container">
<ol>
    <li>Find a Buckeye Innovation book</li>
    <li>Unlock your phone screen</li>
    <li>Touch your phone to the tap zone (camera area for iPhone, center back for Android)</li>
    <li>Get the next hint.</li>
    <li>Repeat for all the tags!</li>
    <li>Return to our booth to collect your prize.</li>
</ol>
</div>
</div>
{:else if tag_number === 1}
    <h1>You found the first tag!</h1>
    {#if tags_tapped.includes(1) }
        <h2>It's great to meet you, {name}.</h2>
        
        <p>You're on a journey to discover some ways NFC tags and web technology can effectively engage and serve your library staff, cardholders, donors, and more!</p>

        <p>Good luck with your scavenger hunt. We'll talk to you very soon... when you find our second tag.</p>

        <h3 class="hint">Hint!</h3>
        <div class="hint-container">{@html tags[tag_number+1].hint}</div>
    {:else}
        <p>Would you share with us a little about yourself?</p>
        <p>
            <label for="name">Your First Name</label>
            <input type="text" id="name" bind:value={name} placeholder="Your First Name" />
        </p>
        <p>
            <label for="library">Your Library / Organization</label>
            <input type="text" id="library" bind:value={library} placeholder="Your Library / Organization" />
        </p>
        <p>
            <label for="email">Your Email Address</label>
            <input type="email" id="email" bind:value={email} placeholder="Your Email Address" />
        </p>
        <button on:click={handleSubmitFirst}>Submit</button>
    {/if}
{:else if tag_number == 2}
    <h1>You found the tag #{tag_number}!</h1>
    <p>Welcome back, {name}.</p>
    {#if !vote || !cta_success.includes(2)}
        {#if !tag_arg}
        <p>Which of the following do you think is the best book series? Tap one to vote.</p>
            {#each vote_options as option}
            <p><button on:click={() => handleSubmitVote(option)}>{option}</button></p>
            {/each}
        {:else}
            <p>You are about to vote for {tag_arg}. Confirm by tapping below.</p>
            <p><button on:click={() => handleSubmitVote(tag_arg)}>Vote for {tag_arg}</button></p>
        {/if}
    {:else}
    <p>Your vote has been cast for <strong>{vote}</strong>. Visit the Buckeye Innovation booth to see the current vote tally.</p>
    <p><button class="simple" on:click={resetVote}>Change my vote</button></p>
    <h2>{tags[tag_number].name}</h2>
    <p>{@html tags[tag_number].text}</p>
    {#if !girls_who_code_saved}
    <button on:click={handleSubmitGirlsWhoCode}>Sign up for Updates</button>
    {:else}
    <p><em>Thanks for signing up for Girls Who Code updates!</em></p>
    <p><a href={tags[tag_number].cta_url} target="_blank">{tags[tag_number].cta_text}</a></p>
    {/if}

    <h3 class="hint">Next Stop Hint!</h3>
    <div class="hint-container">{@html tags[tag_number+1].hint}</div>
    {/if}
{:else if tag_number}
    <h1>You found the tag #{tag_number}!</h1>
    <h2>{tags[tag_number].name}</h2>
    {#if tags[tag_number].text}
    <p>{@html tags[tag_number].text}</p>
    {/if}
    <p><a class="button" href={tags[tag_number].cta_url} target="_blank">{tags[tag_number].cta_text}</a></p>
    {#if tags.length > tag_number + 1}
    <h3 class="hint">Next Stop Hint!</h3>
    <div class="hint-container">{@html tags[tag_number+1].hint}</div>
    {/if}
{/if}

{#if testing}
<div style="text-align: left">
<p>For testing only:</p>
<ol>
    {#each [1,3,4,5,6,7,8] as tag}
    <li><a href={'/?' + btoa(tag)}>Tag {tag}</a></li>
    {/each}
    {#each vote_options as opt}
    <li><a href={'/?' + btoa('2') + '/' + btoa(opt)}>Vote for {opt}</a></li>
    {/each}
</ol>
<button on:click={resetTagsTapped}>Reset Tags Tapped</button>
</div>
{/if}