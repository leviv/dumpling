<script lang="ts">
    function closeButton(){
        this.parentElement.style.visibility = "hidden";
    }

    function openAbout(){
        let aboutbox = document.getElementById("popup") as any;
        aboutbox.style.visibility = "visible";
    }
</script>

<button id="aboutBtn" onclick={openAbout}>?</button>

<!-- how we define dumpling -->
<div id="popup">
    <span class="close" onclick={closeButton}>&#x2715;</span>
    <h3>How do we define dumpling?</h3>
    <p>Since the definition of dumplings have expanded and changed over time, we wanted to see how far we could push the definition. So, we are defining dumplings in the broadest way possible.</p>
    <p>&#9;A broad class of dishes consisting of pieces of cooked dough, often but not always wrapped around a filling.</p>
    <p>While many definitions deliberately leave out certain cooking methods to exclude fritters and other specific foods, we decided to open up our definition to all cooking methods.</p>
    <p>If you think: NO! Egregious! [insert food here] isn't a dumpling! Let us know :D</p>
</div>

<style>
    #aboutBtn {
		position:absolute;
		margin:50px;
		top:0;
		right:0;
		font-size:20px;
		width:30px;
		border-radius:50%;
		color:#76664A;
		background-color:white;
		border-color:transparent;
	}

    #aboutBtn:hover {
        background-color:#fbdda4;
    }

	#popup {
        width:40%;
        position:absolute;
        top:25%;
        left:30%;
        z-index:10;
        background-color:rgba(255, 255, 255, 0.751);
        padding:40px;
        border-radius:25px;
        visibility:hidden;
    }

    :global(.close) {
        cursor:pointer;
        position:absolute;
        top:0;
        right:0;
        padding:25px;
    }
</style>
