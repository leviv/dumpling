<script lang="ts">
	import { fly } from 'svelte/transition';
	import Voting from './Voting.svelte';

	export let dumpling: {
		name: string;
		desc: string;
		tags: string[];
		img: string;
	};
	export let country: string;
</script>

<!-- Implementation based on https://codepen.io/leviv/pen/ByKvNPP?editors=1100 -->
<div class="card" in:fly={{ x: -400, duration: 500 }} out:fly={{ x: -400, duration: 500 }}>
	<div class="title">
		<b>{dumpling.name}</b>
		{#if dumpling.img}
			<img class="dumplingart" src="assets/dumplings/{dumpling.img}" alt="Dumpling art" />
		{/if}
	</div>
	<div class="description">
		{#if dumpling.img === 'sad.png'}
			<p>
				If you happen to know a dumpling from this country, please submit it for us <a
					href="https://forms.gle/1JUj3DmQSH5dTKRQ6"
					target="_blank">here</a
				>
			</p>
		{:else}
			<p>{dumpling.desc}</p>
		{/if}
		<ul>
			{#each dumpling.tags as tag}
				<li>{tag}</li>
			{/each}
		</ul>
	</div>

	{#if dumpling.img !== 'sad.png'}
		<div class="vote">
			<Voting {country} dumplingName={dumpling.name} />
		</div>
	{/if}
</div>

<style>
	.card {
		pointer-events: auto;
		background-color: white;
		background-image:
			linear-gradient(
				180deg,
				white 3rem,
				#f0a4a4 calc(3rem),
				#f0a4a4 calc(3rem + 2px),
				transparent 1px
			),
			repeating-linear-gradient(
				0deg,
				transparent,
				transparent 1.5rem,
				#ddd 1px,
				#ddd calc(1.5rem + 1px)
			);
		box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.25);
		min-height: 14rem;
		width: 400px;
		padding: 0 1rem 1rem 1rem;
		box-sizing: border-box;
		z-index: 2;
	}

	.card:hover {
		z-index: 3;
	}

	.card:hover .vote {
		visibility: visible;
	}

	.vote {
		visibility: hidden;
	}

	.title {
		height: 3rem;
		display: flex;
		align-items: flex-end;
		position: relative;
		padding-bottom: 0;
	}

	.title b {
		flex: 1;
	}

	.description {
		margin: 8px 0 0 0;
	}

	.description p {
		line-height: 23px;
		margin: 0;
	}

	.description ul {
		margin: 0;
		padding-left: 23px;
		line-height: 23px;
	}

	li {
		margin: 0;
	}

	.dumplingart {
		width: 60px;
		height: auto;
		position: absolute;
		right: 0;
		bottom: 0.5rem;
	}
</style>
