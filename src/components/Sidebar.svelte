<script lang="ts">
	import Card from './Card.svelte';
</script>

<div class="container">
	<h1>Sidebar</h1>

	<Card />
	<Card />
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
	}
</style>
