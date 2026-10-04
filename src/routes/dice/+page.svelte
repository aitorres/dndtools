<script lang="ts">
	let dice = [4, 6, 8, 10, 12, 20, 100];
	let selectedDice = 20;
	let quantity = 1;

	let results: number[] = [];

	function rollDice() {
		results = [];
		for (let i = 0; i < quantity; i++) {
			results.push(Math.floor(Math.random() * selectedDice) + 1);
		}
	}
</script>

<h2>dice roller</h2>

<p>
	A simple dice roller for Dungeons and Dragons. Select the type of dice you want to roll and the
	number of dice to roll, then click the "Roll" button to see the results.
</p>

<form>
	<label for="dice">Select a dice type:</label>
	<select id="dice" name="dice" bind:value={selectedDice}>
		{#each dice as die (die)}
			<option value={die}>{die}</option>
		{/each}
	</select>

	<label for="quantity">Number of dice:</label>
	<input type="number" id="quantity" name="quantity" min="1" max="100" bind:value={quantity} />

	<button type="button" on:click={rollDice}>Roll</button>
</form>

{#if results.length > 0}
	<p>
		You rolled {quantity}
		{selectedDice}-sided dice:
	</p>

	<ul>
		{#each results as result, index (index)}
			<li>
				{result}
				{#if result === selectedDice}
					(critical success!)
				{/if}
				{#if result === 1}
					(critical failure...)
				{/if}
			</li>
		{/each}
	</ul>

	{#if results.length > 1}
		<p>
			Total: {results.reduce((acc, cur) => acc + cur, 0)}
		</p>
		<p>
			Lowest: {Math.min(...results)}
		</p>
		<p>
			Highest: {Math.max(...results)}
		</p>
	{/if}
{/if}

<a href="/" class="back-link">&lt; home</a>
