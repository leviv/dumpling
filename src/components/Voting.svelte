<script lang="ts">
	import { castVote, getVotes } from '$lib/firebase';

	let { country, dumplingName }: { country: string; dumplingName: string } = $props();

	let loading = $state(false);
	let hasVoted = $state(false);
	let yesVotes = $state(0);
	let noVotes = $state(0);

	// Reload votes when the component props change
	$effect(() => {
		const voteKey = `${country}-${dumplingName}`;
		const existingVote = localStorage.getItem(voteKey);
		hasVoted = existingVote !== null;
		loadVotes();
	});

	async function loadVotes() {
		try {
			const data = await getVotes(country, dumplingName);
			yesVotes = data.yes;
			noVotes = data.no;
		} catch (error) {
			console.error('Failed to load votes:', error);
		}
	}

	async function vote(isDumpling: boolean) {
		if (loading || hasVoted) {
			return;
		}

		loading = true;

		try {
			const data = await castVote(country, dumplingName, isDumpling);
			yesVotes = data.yes;
			noVotes = data.no;
			hasVoted = true;

			// Store vote in localStorage - cookies
			const voteKey = `${country}-${dumplingName}`;
			localStorage.setItem(voteKey, isDumpling ? 'yes' : 'no');
		} catch (error) {
			console.error('Vote failed:', error);
		} finally {
			loading = false;
		}
	}
</script>

<div class="container">
	<div class="votecard">
		{#if !hasVoted}
			<p>Is this a dumpling?</p>
			<button onclick={() => vote(true)} disabled={loading}>
				<img src="yes.png" alt="yes!" title="yes!" />
			</button>
			<button onclick={() => vote(false)} disabled={loading}>
				<img src="no.png" alt="no!" title="no!" />
			</button>
		{:else}
			<p>Votes:</p>
			<div class="results">
				<div class="vote-count">
					<img src="yes.png" alt="yes" />
					{yesVotes}
				</div>
				<div class="vote-count">
					<img src="no.png" alt="no" />
					{noVotes}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.container {
		position: relative;
	}

	.votecard {
		width: 100px;
		position: absolute;
		right: -25px;
		padding: 2px 4px 2px 4px;
		background-color: #fbfcfb;
		border: 1px #f29f7b solid;
		display: block;
		z-index: 3;
		font-size: 0.7rem;
		text-align: center;
	}

	button {
		font-size: 0.6rem;
		color: #76664a;
		background-color: transparent;
		border: none;
		margin: auto;
		text-align: center;
	}

	button img {
		max-height: 22px;
	}

	button:hover {
		filter: drop-shadow(5px 5px 10px #f29f7b);
	}

	button:active {
		filter: contrast(80%);
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.results {
		display: flex;
		flex-direction: row;
		justify-content: center;
		padding-bottom: 10px;
		gap: 4px;
	}

	.vote-count {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		font-size: 0.7rem;
	}

	.vote-count img {
		max-height: 18px;
	}
</style>
