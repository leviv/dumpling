<script lang="ts">
	export let dumpling: {
		name: string;
		desc: string;
		tags: string[];
	};
</script>

<div class="container">
	<img src="./index_card.jpg" alt="Index card" />
	<div class="content">
		<ul>
			<b>{dumpling.name}</b>
			<p>{dumpling.desc}</p>
			{#each dumpling.tags as tag}
				<li>{tag}</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	li{
		margin-left:20px;
	}

	.container {
		position: relative;
		width: calc(497px * 0.6);
		height: calc(300px * 0.6);
		font-size:0.8rem;
		line-height:0.8rem;
	}

	.content {
		position: absolute;
		top: 7%;
		left:-1.2rem;
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
