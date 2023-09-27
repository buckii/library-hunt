import { json } from '@sveltejs/kit';
import { message } from '$lib/pusher';
import { storeInDB } from "$lib/db/mysql";

export async function POST({ request }) {
    //const { vote, email } = await request.json();
    const data = await request.json();
    console.log('storing in DB');
    
    // store in db
    let result = await storeInDB(data);

    return json(result);
}