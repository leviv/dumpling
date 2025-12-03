<script>
    import box from '$lib/assets/tempbox.png';
    import boxgif from '$lib/assets/boxopening.gif';
    import { goto } from '$app/navigation';

    let myimg = box;

    function changeImg(){
        myimg = boxgif;
        setTimeout(()=>{
            goto('/map');
        }, 2000)
    }
</script>

<!-- landing page -->
 <div id="landingstuff">
    <h1>World Dumpling Index</h1>
    <img id="box" alt="box with world dumpling index on it" src={myimg} on:click={changeImg}>
    <a href="/map">Click to Enter</a>
 </div>

<style>
    #box {
        width:100%;
        margin-bottom:20px;
    }
	#landingstuff {
		margin: auto;
        width: 50%;
        padding-top:30%;
        text-align:center;
	}
</style>