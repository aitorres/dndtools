<script lang="ts">
    // Getting the list of all spells from DnD 5e API

    import { onMount } from 'svelte';
    import { getSpells, getSpell } from '$lib/api';
    import jsPDF from 'jspdf';
    import autoTable from 'jspdf-autotable';

    type Spell = { index: string, name: string, level: number }
    let spells: Spell[] = [];
    let selectedSpells: Spell[] = [];

    onMount(async () => {
        spells = await getSpells();
    });

    function addSpell() {
        const selectElement = document.getElementById('spell') as HTMLSelectElement;
        const selectedIndex = selectElement.value;
        const selectedSpell = spells.find(spell => spell.index === selectedIndex);
        if (selectedSpell && !selectedSpells.includes(selectedSpell)) {
            selectedSpells = [...selectedSpells, selectedSpell];
        }
    }

    function removeSpell() {
        const selectElement = document.getElementById('spell') as HTMLSelectElement;
        const selectedIndex = selectElement.value;
        selectedSpells = selectedSpells.filter(spell => spell.index !== selectedIndex);
    }

    async function generatePDF() {
        const doc = new jsPDF();

        selectedSpells.sort((a, b) => {
            if (a.level === b.level) {
                return a.name.localeCompare(b.name);
            }
            return a.level - b.level;
        });

        autoTable(doc, {
            head: [['Spell', 'Level', 'Duration', 'Range', 'Description']],
            body: await Promise.all(selectedSpells.map(spell => getFullSpell(spell.index)))
        });

        doc.save('selected_spells.pdf');
    }

    async function getFullSpell(index: string): Promise<[string, number, string, string, string]> {
        const spell = await getSpell(index);

        return [spell.name, spell.level, spell.duration, spell.range, spell.desc.join('\n')];

    }

</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

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
