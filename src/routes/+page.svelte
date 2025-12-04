<script>
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	let myimg = `${base}/tempbox.png`;

	function changeImg() {
		myimg = `${base}/boxopening.gif`;
		setTimeout(() => {
			goto(`${base}/map`);
		}, 2000);
	}
</script>

<!-- landing page -->
<div id="landingstuff">
	<h1>World Dumpling Index</h1>
	<img id="box" alt="box with world dumpling index on it" src={myimg} on:click={changeImg} />
	<a href="{base}/map">Click to Enter</a>
</div>

<style>
	#box {
		width: 100%;
		margin-bottom: 20px;
	}
	#landingstuff {
		margin: auto;
		width: 50%;
		padding-top: 30%;
		text-align: center;
	}
</style>
