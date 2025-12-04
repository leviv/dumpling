<script lang="ts">
	import Map from '../../components/Map.svelte';
	import Sidebar from '../../components/Sidebar.svelte';
	import Disclaimer from '../../components/Disclaimer.svelte';

	let selectedCountry: string = '';
</script>

<svelte:head>
	<title>World Dumpling Index</title>
</svelte:head>

<div class="container">
	<Sidebar {selectedCountry} />
	<Map bind:selectedCountry />
</div>
<Disclaimer/>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	.container {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 100vh;
	}
</style>
