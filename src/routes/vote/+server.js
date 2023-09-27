import { message } from '$lib/pusher';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    //const { vote, email } = await request.json();
    const data = await request.json();
    
    message(data);

    return json(data);
}