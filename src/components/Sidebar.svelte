<script lang="ts">
	import Card from './Card.svelte';

	export let selectedCountry: string;
</script>

<div class="container">
	<h1>World Dumpling Index</h1>

	<p>Selected Country: {selectedCountry}</p>

	<Card />
	<Card />
</div>

<style>
	.container {
		background: #dcd485;
		width: 350px;
		display: flex;
		flex-direction: column;
		padding: 50px;
		height: 100%;
		overflow: scroll;
		gap: 5px;
	}
</style>
