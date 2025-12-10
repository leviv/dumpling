<script>
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	let myimg = `${base}/box.png`;

	function changeImg() {
		myimg = `${base}/boxopen.gif`;
		setTimeout(() => {
			goto(`${base}/map`);
		}, 1500);
	}
</script>

<img id="bg" src="bg.png" alt="background texture" />
<!-- landing page -->
<div id="landingstuff">
	<!-- <h1>World Dumpling Index</h1> -->
	<img id="title" src="title.png" alt="World Dumpling Index title" />
	<img id="box" alt="box with world dumpling index on it" src="box.png" on:click={changeImg} />
	<p>Click the box to enter</p>
</div>

<style>
	/* :global(body){
		background-image:url('/bg.png');
		background-size:cover;
	} */

	p {
		font-family: 'Stylish';
		font-size: 1rem;
		color: #73664e;
	}

	#box {
		width: 100%;
		margin-bottom: 20px;
	}

	#bg {
		max-width: 100vw;
		position: fixed;
		z-index: -1;
		top: 0;
	}

	#landingstuff {
		margin: auto;
		width: 50%;
		padding-top: 10%;
		text-align: center;
	}
	#title {
		width: 600px;
		left: 0;
		right: 0;
		margin: auto;
		position: absolute;
		z-index: 2;
		top: 10%;
	}
</style>
