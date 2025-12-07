<script lang="ts">
	export let dumpling: {
		name: string;
		desc: string;
		tags: string[];
		img: string;
	};
</script>

<div class="container">
	<img class="indexcard" src="./index_card.jpg" alt="Index card" />
	<div class="content">
		<ul>
			<b>{dumpling.name}</b>
			<p>{dumpling.desc}</p>
			{#each dumpling.tags as tag}
				<li>{tag}</li>
			{/each}
			<img class="dumplingart" src="assets/dumplings/{dumpling.img}" alt="Dumpling art" />
		</ul>
	</div>
</div>

<style>
	li {
		margin-left: 20px;
	}

	.container {
		position: relative;
		width: calc(497px * 0.6);
		height: calc(300px * 0.6);
		font-size: 0.8rem;
		line-height: 0.8rem;
	}

	.content {
		position: absolute;
		top: 7%;
		left: -1.2rem;
		width: 99%;
	}

	.indexcard {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.dumplingart {
		width: 60px;
		height: auto;
		position: absolute;
		top: -10px;
		right: -10px;
	}
</style>
