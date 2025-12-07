<script lang="ts">
	import Card from './Card.svelte';
	import dumplings from '$lib/dumplings.json';
	import Voting from './Voting.svelte';

	export let selectedCountry: string;

	$: dumplingInfo = dumplings.find((d) => d.country === selectedCountry);
	console.log(dumplingInfo);
</script>

<div class="container">
	<h1>World Dumpling Index</h1>

	<p>Selected Country: {selectedCountry}</p>

	{#each dumplingInfo?.dumplings as dumpling}
		<Card {dumpling} />
		<Voting/>
	{/each}
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
