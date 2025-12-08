<script lang="ts">
	import Map from '../../components/Map.svelte';
	import Sidebar from '../../components/Sidebar.svelte';
	import Disclaimer from '../../components/Disclaimer.svelte';
	import About from '../../components/About.svelte';

	let selectedCountry: string = '';
</script>

<svelte:head>
	<title>World Dumpling Index</title>
</svelte:head>

<div class="container">
	<Sidebar {selectedCountry} />
	<Map bind:selectedCountry />
</div>
<Disclaimer />
<About />

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		color: #76664a;
	}

	:global(h1) {
		font-family: 'Reenie Beanie';
		font-size: 2.2vw;
	}

	:global(h3, p, ul, button) {
		font-family: 'Stylish';
	}

	.container {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 100vh;
	}
</style>
