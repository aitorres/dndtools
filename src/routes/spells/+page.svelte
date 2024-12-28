<script lang="ts">
	import { onMount } from 'svelte';
	import { getSpells, getSpell, type SpellStub, type Spell } from '$lib/api';
	import jsPDF from 'jspdf';
	import autoTable from 'jspdf-autotable';

	let spells: SpellStub[] = [];
	let selectedSpells: SpellStub[] = [];

	onMount(async () => {
		spells = await getSpells();
	});

	// Add a spell to the selected spells list
	function addSpell(): void {
		const selectElement = document.getElementById('spell') as HTMLSelectElement;
		const selectedIndex = selectElement.value;
		const selectedSpell = spells.find((spell) => spell.index === selectedIndex);
		if (selectedSpell && !selectedSpells.includes(selectedSpell)) {
			selectedSpells = [...selectedSpells, selectedSpell];
		}

		selectElement.value = '';
	}

	// Remove a spell from the selected spells list
	function removeSpell(): void {
		const selectElement = document.getElementById('spell') as HTMLSelectElement;
		const selectedIndex = selectElement.value;
		selectedSpells = selectedSpells.filter((spell) => spell.index !== selectedIndex);
	}

	// Generate a PDF with the selected spells
	async function generatePDF(): Promise<void> {
		const doc = new jsPDF();

		selectedSpells.sort((a, b) => {
			if (a.level === b.level) {
				return a.name.localeCompare(b.name);
			}
			return a.level - b.level;
		});

		autoTable(doc, {
			head: [['Spell', 'Level', 'Duration', 'Range', 'Description']],
			body: await Promise.all(selectedSpells.map((spell) => getFullSpell(spell.index))).then((results) => results.filter((result) => result !== null))
		});

		doc.save('selected_spells.pdf');
	}

	// Get the full information of a spell
	async function getFullSpell(index: string): Promise<[string, number, string, string, string] | null> {
		var spell: Spell;

		try {
			spell = await getSpell(index);
		} catch (error) {
			console.error(error);
			return null;
		}

		return [spell.name, spell.level, spell.duration, spell.range, spell.desc.join('\n')];
	}
</script>

<h2>printable spells reference sheet generator</h2>

<p>
	Select one or more spells from the list below to generate a printable PDF with each spell's
	information.
</p>

<form>
	<label for="spell">Select a spell:</label>
	<input list="spells" id="spell" name="spell" />
	<datalist id="spells">
		{#each spells as spell}
			<option value={spell.index}>{spell.name}</option>
		{/each}
	</datalist>
	<button type="button" on:click={addSpell}>Add Spell</button>
	<button type="button" on:click={removeSpell}>Remove Spell</button>

	<h3>Selected spells</h3>
	{#if selectedSpells.length > 0}
		<ul>
			{#each selectedSpells as spell}
				<li>{spell.name} (Level {spell.level})</li>
			{/each}
		</ul>
	{:else}
		<p>No spells selected yet.</p>
	{/if}

	{#if spells.length > 0}
		<button type="button" on:click={generatePDF}>Generate PDF</button>
	{/if}
</form>

<a href="/" class="back-link">&lt; home</a>
