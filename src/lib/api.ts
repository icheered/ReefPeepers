async function uploadData(formData) {
    try {
        const response = await fetch('/api/species', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Error uploading data');

        const data = await response.json();
        return data;
    } catch (e) {
        console.error('Error uploading data: ', e);
    }
};

async function getAllSpecies() {
    try {
        const response = await fetch('/api/species');

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (e) {
        console.error('Error getting all species: ', e);
    }
};

async function deleteSpecies(id) {
    try {
        const response = await fetch(`/api/species/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete species');
    } catch (e) {
        console.error('Error deleting species: ', e);
    }
};

export { uploadData, getAllSpecies, deleteSpecies };
