<script lang="ts">
	import Card from './Card.svelte';
	import dumplings from '$lib/dumplings.json';
	import Voting from './Voting.svelte';
	import { getCountryFlag } from '../helpers/flagMap';

	export let selectedCountry: string;

	$: dumplingInfo = dumplings.find((d) => d.country === selectedCountry);
	$: countryFlag = getCountryFlag(selectedCountry);
	console.log(dumplingInfo);
</script>

<div class="container">
	<h1>World Dumpling Index</h1>

	<h3><b>{countryFlag} {selectedCountry}</b></h3>

	{#each dumplingInfo?.dumplings as dumpling}
		<Card {dumpling} />
		<Voting />
	{/each}
</div>

<style>
	.container {
		position: absolute;
		top: 0;
		left: 0;
		width: 350px;
		display: flex;
		flex-direction: column;
		padding: 50px;
		height: 100%;
		overflow: scroll;
		gap: 1vh;
	}
</style>
