<div class="container">
	<div class="votecard">
		<p>Is this a dumpling?</p>
		<button><img src="/assets/yes.png" alt="yes!" title="yes!" /></button>
		<button><img src="/assets/no.png" alt="no!" title="no!" /></button>
	</div>
</div>

<style>
	.container {
		position: relative;
	}
	.votecard {
		width: 35%;
		padding: 2px 4px 2px 4px;
		background-color: #fbfcfb;
		border: 1px #f29f7b solid;
		position: absolute;
		display: block;
		left: 75%;
		top: -65px;
		z-index: 3;
		font-size: 0.7rem;
		text-align: center;
	}

	button :global {
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
	button:hover :global {
		filter: drop-shadow(5px 5px 10px #f29f7b);
	}
	button:active :global {
		filter: contrast(80%);
	}
</style>
