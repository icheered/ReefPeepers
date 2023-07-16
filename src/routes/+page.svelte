<script lang="ts">
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import { constructFormData } from '$lib/utils.ts';
	import { uploadData, getAllSpecies, deleteSpecies } from '$lib/api.ts';

	const name = writable('');
	let fileInput: any;
	const species = writable([]);

	onMount(async () => {
		const fetchedSpecies = await getAllSpecies();
		species.set(fetchedSpecies);
	});
</script>

<form
	on:submit|preventDefault={async () => {
		const formData = constructFormData($name, fileInput.files[0]);
		await uploadData(formData);
		name.set('');
		fileInput.value = '';
		const fetchedSpecies = await getAllSpecies();
		species.set(fetchedSpecies);
	}}
>
	<label for="name">Fish Name:</label>
	<input id="name" type="text" bind:value={$name} required />

	<label for="image">Image:</label>
	<input id="image" type="file" accept="image/*" bind:this={fileInput} required />

	<button type="submit">Upload</button>
</form>

<div class="w-full grid grid-cols-3 place-items-center pt-24">
	{#each $species as item (item.id)}
		<div class="text-2xl text-center col-span-1">
			{item.name}
		</div>
		<div class="col-span-1">
			<img src={item.image} alt={item.name} />
		</div>
		<div class="col-span-1">
			<button
				class="btn btn-primary"
				on:click={async () => {
					await deleteSpecies(item.id);
					const fetchedSpecies = await getAllSpecies();
					species.set(fetchedSpecies);
				}}>Delete</button
			>
		</div>
	{/each}
</div>
