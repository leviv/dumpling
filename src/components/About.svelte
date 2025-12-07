<script lang="ts">
    function closeButton(){
        this.parentElement.style.visibility = "hidden";
    }
</script>

<button id="aboutBtn">?</button>

<!-- how we define dumpling -->
<div class="popup">
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

	:global(.popup) {
        width:50%;
        position:absolute;
        top:25%;
        left:25%;
        z-index:10;
        background-color:white;
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
