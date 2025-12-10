<script lang="ts">
	function closeButton() {
		this.parentElement.style.visibility = 'hidden';
	}

	function openAbout() {
		let aboutbox = document.getElementById('popup') as any;
		aboutbox.style.visibility = 'visible';
	}
</script>

<button id="aboutBtn" onclick={openAbout}>?</button>

<!-- how we define dumpling -->
<div id="popup">
	<button class="close" onclick={closeButton}>
		<span>&#x2715;</span>
	</button>
	<h3>How do we define dumpling?</h3>
	<p>
		Since the definition of dumplings have expanded and changed over time, we wanted to see how far
		we could push the definition. So, we are defining dumplings in the broadest way possible.
	</p>
	<p>
		&#9;A broad class of dishes consisting of pieces of cooked dough, often but not always wrapped
		around a filling.
	</p>
	<p>
		While many definitions deliberately leave out certain cooking methods to exclude fritters and
		other specific foods, we decided to open up our definition to all cooking methods.
	</p>
	<p>If you think: NO! Egregious! [insert food here] isn't a dumpling! Let us know :D</p>

	<p>
		This site was lovingly created by Dae and Levi in fall 2025 for Connections Lab @ NYU
		IMA-Low-Res
	</p>
</div>

<style>
	#aboutBtn {
		cursor: pointer;
		position: absolute;
		margin: 12px;
		top: 0;
		right: 0;
		font-size: 20px;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		color: #76664a;
		background-color: #fff;
		border-color: transparent;
		box-shadow:
			0px 0px 0.5px rgba(0, 0, 0, 0.3),
			0px 1px 3px rgba(0, 0, 0, 0.15);
	}

	#aboutBtn:hover {
		background-color: #f29f7b92;
	}

	#popup {
		width: 40%;
		position: absolute;
		top: 25%;
		left: 30%;
		z-index: 10;
		background-color: rgba(255, 255, 255, 0.751);
		padding: 40px;
		border-radius: 25px;
		visibility: hidden;
	}

	.close {
		cursor: pointer;
		position: absolute;
		top: 0;
		right: 0;
		padding: 25px;
		background-color: transparent;
		border: none;
	}
	.close:hover {
		color: #f29f7b;
	}
</style>
