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
	<div class="title">
		<h1>World Dumpling Index - {selectedCountry} {countryFlag}</h1>
	</div>

	{#each dumplingInfo?.dumplings as dumpling}
		<Card {dumpling} />
		<Voting />
	{/each}
</div>

<style>
	.title {
		width: fit-content;
		padding: 0 20px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 13px;
		box-shadow:
			0px 0px 0.5px rgba(0, 0, 0, 0.3),
			0px 1px 3px rgba(0, 0, 0, 0.15);
		color: rgba(0, 0, 0, 0.9);
		background-color: #fff;
		margin: 0;
		height: 48px;
	}

	.title h1 {
		font-size: 25px;
	}

	.container {
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		padding: 12px;
		height: 100%;
		overflow: scroll;
		gap: 1vh;
		pointer-events: none;
	}
</style>
