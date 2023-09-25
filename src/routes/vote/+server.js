import { PUSHER_APP_ID, PUSHER_SECRET } from "$env/static/private";
import { PUBLIC_PUSHER_KEY, PUBLIC_PUSHER_CHANNEL, PUBLIC_PUSHER_EVENT } from "$env/static/public";
import { json } from '@sveltejs/kit';
import Pusher from 'pusher';

export async function POST({ request }) {
    //const { vote, email } = await request.json();
    const data = await request.json();
    
    const pusher = new Pusher({
        appId: PUSHER_APP_ID,
        key: PUBLIC_PUSHER_KEY,
        secret: PUSHER_SECRET,
        cluster: "us2",
        useTLS: true
    });

    pusher.trigger(PUBLIC_PUSHER_CHANNEL, PUBLIC_PUSHER_EVENT, {
        message: data
    });

    return json(data);
}