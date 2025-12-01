<script lang="ts">
	import Card from './Card.svelte';

	export let selectedCountry: string;
</script>

<div class="container">
	<h1>Sidebar</h1>

	<p>selectedCountry: {selectedCountry}</p>

	<Card />
	<Card />
</div>

<style>
	.container {
		background: #dcd485;
		width: 250px;
		display: flex;
		flex-direction: column;
	}
</style>
