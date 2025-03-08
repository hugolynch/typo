<script lang="ts">
  let { letters, edit } = $props();
  console.log(edit);
</script>

<div class="word">
  {#each [...letters] as letter, index}
    {#if edit.type === "shuffle"}
      <span class="{edit.type} letter">{letter}</span>
    {:else if edit.type === "deletion"}
      {#if edit.index === index + 1}
        <span class="{edit.type} left letter">{letter}</span>
      {:else if edit.index === index}
        <span class="{edit.type} right letter">{letter}</span>
      {:else}
        <span class="letter">{letter}</span>
      {/if}
    {:else if edit.index === index}
      <span class="{edit.type} letter">{letter}</span>
    {:else}
      <span class="letter">{letter}</span>
    {/if}
  {/each}
</div>

<style>
  .word {
    display: flex;
    margin: 0 auto;
    gap: 4px;
    border: 1px solid grey;
    padding: 4px;
  }

  .letter {
    border: 1px solid grey;
    padding: 12px;
  }

  .substitution {
    background-color: #F9F2E7;
    border: 1px solid #E8C68E;
  }

  .shuffle {
    background-color: #E9F5FE;
    border: 1px solid #98D1FA;
  }

  .insertion {
    background-color: #EDF5EB;
    border: 1px solid #ACD6A3;
  }

  .deletion {
    border: double 1px transparent;
    border-radius: 6px;
    background-image: linear-gradient(var(--degs), #fff0ef, #f2f3fb),
      linear-gradient(var(--degs), #ffb9b8, #c9cad6);
    background-origin: border-box;
    background-clip: padding-box, border-box;
  }

  .deletion.right {
    --degs: 90deg;
  }

  .deletion.left {
    --degs: 270deg;
  }
</style>
