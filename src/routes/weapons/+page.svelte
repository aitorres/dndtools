<script lang="ts">
	import { onMount } from 'svelte';
	import { getWeapons, getWeapon, type WeaponStub, type Weapon } from '$lib/api';
	import jsPDF from 'jspdf';
	import autoTable from 'jspdf-autotable';

	let weapons: WeaponStub[] = [];
	let selectedWeapons: WeaponStub[] = [];

	onMount(async () => {
		weapons = await getWeapons();
	});

	// Add a weapon to the selected weapons list
	function addWeapon(): void {
		const selectElement = document.getElementById('weapon') as HTMLSelectElement;
		const selectedIndex = selectElement.value;
		const selectedWeapon = weapons.find((weapon) => weapon.index === selectedIndex);
		if (selectedWeapon && !selectedWeapons.includes(selectedWeapon)) {
			selectedWeapons = [...selectedWeapons, selectedWeapon];
		}

		selectElement.value = '';
	}

	// Remove a weapon from the selected weapons list
	function removeWeapon(): void {
		const selectElement = document.getElementById('weapon') as HTMLSelectElement;
		const selectedIndex = selectElement.value;
		selectedWeapons = selectedWeapons.filter((weapon) => weapon.index !== selectedIndex);
	}

	// Generate a PDF with the selected weapons
	async function generatePDF(): Promise<void> {
		const doc = new jsPDF();

		selectedWeapons.sort((a, b) => {
			return a.name.localeCompare(b.name);
		});

		autoTable(doc, {
			head: [['Weapon', 'Damage', 'Damage Type', 'Range', 'Properties']],
			body: await Promise.all(
				selectedWeapons.map((weapon) => getFullWeapon(weapon.index).catch(() => null))
			).then((results) => results.filter((result) => result !== null))
		});

		doc.save('selected_weapons.pdf');
	}

	// Get the full information of a weapon
	async function getFullWeapon(
		index: string
	): Promise<[string, string, string, string, string] | null> {
		var weapon: Weapon;

		try {
			weapon = await getWeapon(index);
		} catch (error) {
			console.error(error);
			return null;
		}

		return [
			weapon.name,
			weapon.damage.damage_dice,
			weapon.damage.damage_type.name,
			weapon.weapon_range,
			weapon.properties.map((property) => property.name).join(', ')
		];
	}
</script>

<h2>printable weapons reference sheet generator</h2>

<p>
	Select one or more weapons from the list below to generate a printable PDF with each weapon's
	information.
</p>

<form>
	<label for="weapon">Select a weapon:</label>
	<input list="weapons" id="weapon" name="weapon" />
	<datalist id="weapons">
		{#each weapons as weapon}
			<option value={weapon.index}>{weapon.name}</option>
		{/each}
	</datalist>
	<button type="button" on:click={addWeapon}>Add Weapon</button>
	<button type="button" on:click={removeWeapon}>Remove Weapon</button>

	<h3>Selected weapons</h3>
	{#if selectedWeapons.length > 0}
		<ul>
			{#each selectedWeapons as weapon}
				<li>{weapon.name}</li>
			{/each}
		</ul>
	{:else}
		<p>No weapons selected yet.</p>
	{/if}

	{#if weapons.length > 0}
		<button type="button" on:click={generatePDF}>Generate PDF</button>
	{/if}
</form>

<a href="/" class="back-link">&lt; home</a>
