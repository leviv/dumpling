<script lang="ts">
    import dumplings from '$lib/dumplings.json';
</script>

<div class="container">
    <div class="votecard">
        <p>Is this a dumpling?</p>
        <button>yes!</button>
        <button>no!</button>
    </div>
</div>


<style>
    .container {
        position:relative;
    }
    .votecard {
        width:35%;
        padding:8px;
        background-color:#FBFCFB;
        border: 1px #f29f7B solid;
        position:absolute;
        display:block;
        left:75%;
        top:-65px;
        z-index:3;
        font-size:0.7rem;
        text-align:center;
    }

    button :global{
        font-size:0.6rem;
        color:#76664A;
        background-color:transparent;
        border:none;
        margin:auto;
        text-align:center;
    }
    button:hover :global{
        background-color:#f29f7b95;
    }
    button:active :global{
        background-color:#f29f7B;
    }
</style>