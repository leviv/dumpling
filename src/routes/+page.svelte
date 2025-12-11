<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	let gifElement: HTMLImageElement;
	let isPlaying = false;

	onMount(() => {
		// Pause the gif on load
		pauseGif();
	});

	// Use this play/pause gif implementation https://gist.github.com/donatj/8ec12c55f256c09fdfd2ecd153404c06

	function pauseGif() {
		if (!gifElement) {
			return;
		}

		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			return;
		}

		const img = document.createElement('img');
		img.onload = function () {
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);
			gifElement.src = canvas.toDataURL();
		};
		const dataSrc = gifElement.getAttribute('data-src');
		if (dataSrc) {
			img.src = dataSrc;
		}
	}

	function changeImg() {
		if (isPlaying) {
			return;
		}
		isPlaying = true;

		// Play the gif
		const dataSrc = gifElement.getAttribute('data-src');
		if (dataSrc) {
			gifElement.src = dataSrc;
		}

		// Navigate to /map after gif ends
		setTimeout(() => {
			pauseGif();
			goto(`${base}/map`);
		}, 1000);
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			changeImg();
		}
	}
</script>

<!-- landing page -->
<div class="container">
	<div id="landingstuff">
		<img id="title" src="title.png" alt="World Dumpling Index title" />
		<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
		<img
			id="box"
			bind:this={gifElement}
			data-src="boxopen.gif"
			alt="box with world dumpling index on it"
			src="boxopen.gif"
			on:click={changeImg}
			on:keypress={handleKeyPress}
			tabindex="0"
			role="button"
		/>
		<p>Click the box to enter</p>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
	.container {
		width: 100%;
		height: 100vh;
		background-image: url('{base}/bg.png');
		background-size: cover;
		background-position: center;
	}

	p {
		font-family: 'Stylish';
		font-size: 1rem;
		color: #73664e;
	}

	#box {
		max-width: 1200px;
		margin-bottom: 20px;
	}

	#landingstuff {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 40px;
	}

	#title {
		width: 600px;
	}
</style>
