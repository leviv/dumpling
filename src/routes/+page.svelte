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
	<p>Click the box to enter</p>
</div>

<style>
	h1 {
		font-family:"Reenie Beanie";
		font-size:3rem;
	}

	p {
		font-family:"Stylish";
		font-size:1rem;
	}

	#box {
		width: 60%;
		margin-bottom: 20px;
	}
	#landingstuff {
		margin: auto;
		width: 50%;
		padding-top: 10%;
		text-align: center;
	}
</style>
