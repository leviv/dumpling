<div class="container">
	<img src="./index_card.jpg" alt="Index card" />
	<div class="content">
		<ul>
			<li>Country: Wonderland</li>
			<li>Dumpling Index: 85</li>
			<li>Favorite Dumpling: Magic Puff</li>
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
