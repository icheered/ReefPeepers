<script lang="ts">
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import { constructFormData } from '$lib/utils.ts';
	import { uploadData, getAllSpecies, deleteSpecies, toggleSpeciesSeen } from '$lib/api.ts';

	import FaTrash from 'svelte-icons/fa/FaTrash.svelte';
	import FaPlus from 'svelte-icons/fa/FaPlus.svelte';
	import FaPen from 'svelte-icons/fa/FaPen.svelte';
	import FaSave from 'svelte-icons/fa/FaSave.svelte';

	const name = writable('');
	let fileInput: any;
	const species = writable([]);

	let showAddNew = false;
	let inEditMode = false;

	async function deleteSpeciesById(id: string) {
		await deleteSpecies(id);
		const fetchedSpecies = await getAllSpecies();
		species.set(fetchedSpecies);
	}

	async function toggleSpeciesActive(id: string) {
		const updatedSpecies = await toggleSpeciesSeen(id);
		species.update((items) => {
			const itemIndex = items.findIndex((item) => item.id === id);
			if (itemIndex !== -1) {
				items[itemIndex].seen = updatedSpecies.seen; // Replace the species with updated one
			}
			return items; // return the updated array
		});
	}

	onMount(async () => {
		const fetchedSpecies = await getAllSpecies();
		species.set(fetchedSpecies);
	});
</script>

<div class="flex flex-col justify-center place-items-center pt-4">
	<div class="text-4xl">ReefPeepers</div>
	<a href="https://icheered.nl/" target="_blank">
		Made by <span class="underline text-orange-500"> ICheered </span>
	</a>

	<div class="flex flex-row gap-x-4 pt-2">
		<button
			class="icon transition-all"
			class:rotate-45={showAddNew}
			on:click={() => (showAddNew = !showAddNew)}
			on:keydown={() => (showAddNew = !showAddNew)}
		>
			<FaPlus />
		</button>
		<label id="themeswitcher" class="swap swap-rotate" class:swap-active={inEditMode}>
			<input type="checkbox" />

			<div class="swap-on fill-current w-8 h-8">
				<button
					class="icon text-success"
					on:click={() => (inEditMode = !inEditMode)}
					on:keydown={() => (inEditMode = !inEditMode)}
				>
					<FaSave />
				</button>
			</div>
			<div class="swap-off fill-current w-8 h-8">
				<button
					class="icon"
					on:click={() => (inEditMode = !inEditMode)}
					on:keydown={() => (inEditMode = !inEditMode)}><FaPen /></button
				>
			</div>
		</label>
	</div>
	{#if showAddNew}
		<form
			class="flex flex-col bg-base-300 gap-4 m-4 p-4 rounded-md"
			on:submit|preventDefault={async () => {
				const formData = constructFormData($name, fileInput.files[0]);
				await uploadData(formData);
				name.set('');
				fileInput.value = '';
				const fetchedSpecies = await getAllSpecies();
				species.set(fetchedSpecies);
			}}
		>
			<div class="w-full text-center">Add new</div>

			<input
				type="text"
				bind:value={$name}
				required
				placeholder="Fish name"
				class="input input-bordered border-primary-light dark:border-primary-dark w-full max-w-xs"
			/>

			<input
				type="file"
				class="file-input file-input-bordered dark:border-primary-dark w-full max-w-xs"
				accept="image/*"
				bind:this={fileInput}
				required
			/>

			<button type="submit" class="btn bg-primary-light dark:bg-primary-dark dark:text-white"
				>Upload</button
			>
		</form>
	{/if}

	<div class="w-full grid grid-cols-3 gap-2 pt-10 px-2">
		{#each $species as item (item.id)}
			<div class="col-span-1">
				<button
					class="relative"
					on:click={toggleSpeciesActive(item.id)}
					on:keydown={toggleSpeciesActive(item.id)}
				>
					<img
						class="rounded-md border-4 {item.seen ? 'saturate-100' : 'saturate-0'}"
						src={`/api/image/${item.image}`}
						alt={item.name}
						class:border-primary-light={item.seen}
						class:dark:border-primary-dark={item.seen}
						class:border-base-100={!item.seen}
					/>
					{#if inEditMode}
						<button
							class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 icon text-red-500"
							on:click={async () => {
								await deleteSpeciesById(item.id);
							}}
						>
							<FaTrash />
						</button>
					{/if}
				</button>

				<div class="text-center {item.seen ? 'opacity-100' : 'opacity-20'}">
					{item.name}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.icon {
		width: 24px;
		height: 24px;
	}
</style>
