<script lang="ts">
	import Map from '../../components/Map.svelte';
	import Sidebar from '../../components/Sidebar.svelte';
</script>

<svelte:head>
	<title>World Dumpling Index</title>
</svelte:head>

<div class="container">
	<Sidebar />
	<Map />
</div>

<style>
	.container {
		display: flex;
		flex-direction: row;
		width: 100%;
	}
</style>
