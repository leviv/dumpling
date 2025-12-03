<script lang="ts">
	export let dumpling: {
		name: string;
		tags: string[];
	};
</script>

<div class="container">
	<img src="./index_card.jpg" alt="Index card" />
	<div class="content">
		<ul>
			<li>{dumpling.name}</li>
			{#each dumpling.tags as tag}
				<li>{tag}</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.container {
		position: relative;
		width: calc(497px * 0.6);
		height: calc(300px * 0.6);
	}

	.content {
		position: absolute;
		top: 0;
	}

	.container img {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
</style>
