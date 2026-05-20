<script>
	import { resolve } from '$app/paths';
</script>

<p>
	A list of small tools and utilities for Dungeons and Dragons dungeon masters and players,
	including a dice roller and several printable reference sheet generators, leveraging the <a
		href="https://dnd5eapi.co"
		title="DND 5e API">DND 5e API</a
	>.
</p>

<div class="cards">
	<div class="card">
		<a href={resolve('/dice')}>
			<h3>Dice Roller</h3>
		</a>
	</div>

	<div class="card">
		<a href={resolve('/spells')}>
			<h3>Printable Spell List</h3>
		</a>
	</div>

	<div class="card">
		<a href={resolve('/weapons')}>
			<h3>Printable Weapon List</h3>
		</a>
	</div>
</div>
