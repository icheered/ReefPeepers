import { PrismaClient } from '@prisma/client';
import { uploadToFileBrowser, getFileBrowserFileURL } from '$lib/filebrowser';
import crypto from "crypto";

const prisma = new PrismaClient();

export async function POST({ request }) {
    try {
        const data = Object.fromEntries(await request.formData())

        const fileName = `${crypto.randomUUID()}.${((data.image as Blob).type.split("/")[1])}`;
        const fileContents = Buffer.from(await data.image.arrayBuffer());

        await uploadToFileBrowser(fileName, fileContents, data.image.type);

        const species = await prisma.species.create({
            data: {
                name: await data.name as string,
                image: fileName // store just the file name in the database
            }
        });

        return new Response(JSON.stringify(species), { status: 200 });

    } catch (error) {
        console.log("Error: ", error)
        return new Response(JSON.stringify(error), { status: 500 })
    }
}

export async function GET() {
    try {
        let species = await prisma.species.findMany();

        species = await Promise.all(species.map(async species => {
            const url = getFileBrowserFileURL(species.image);
            return { ...species, image: url };
        }));

        return new Response(JSON.stringify(species), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: 'An error occurred while fetching species.' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}