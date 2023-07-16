// src/routes/api/image/[filename].js
import { getFileBrowserFileURL } from '$lib/filebrowser';
import fetch from 'node-fetch';

export async function GET({ params }) {
    try {
        const { filename } = params;
        const { url, token } = await getFileBrowserFileURL(filename);

        const imageResponse = await fetch(url, {
            headers: { 'X-Auth': token }
        });

        if (!imageResponse.ok) {
            throw new Error(`HTTP error! status: ${imageResponse.status}`);
        }

        const buffer = await imageResponse.arrayBuffer();
        const headers = {
            'Content-Type': imageResponse.headers.get('Content-Type'),
            'Content-Length': imageResponse.headers.get('Content-Length')
        };

        return new Response(buffer, {
            status: 200,
            headers: headers
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
