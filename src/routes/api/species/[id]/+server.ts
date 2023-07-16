import { PrismaClient } from '@prisma/client';
import { deleteFromFileBrowser } from '$lib/filebrowser';


const prisma = new PrismaClient();



export async function DELETE({ params }) {
    const { id } = params; // get the ID from the request parameters

    try {
        // Fetch the species to get the file path
        const species = await prisma.species.findUnique({
            where: { id: Number(id) },
        });

        if (!species) {
            return new Response(JSON.stringify({ error: 'Species not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Delete the file in FileBrowser

        await deleteFromFileBrowser(species.image);

        // Delete the species from the database
        const deletedSpecies = await prisma.species.delete({
            where: { id: Number(id) }, // convert string to number
        });

        // Return the deleted species
        return new Response(JSON.stringify(deletedSpecies), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        // Handle the error
        console.error("Error: ", error);
        return new Response(JSON.stringify(error), { status: 500 });
    }
}

