<script lang="ts">
	import Map from '../../components/Map.svelte';
	import Sidebar from '../../components/Sidebar.svelte';

	let selectedCountry: string = '';
</script>

<svelte:head>
	<title>World Dumpling Index</title>
</svelte:head>

<div class="container">
	<Sidebar {selectedCountry} />
	<Map bind:selectedCountry />
</div>

<style>
	.container {
		display: flex;
		flex-direction: row;
		width: 100%;
	}
</style>
