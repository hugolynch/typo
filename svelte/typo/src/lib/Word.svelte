<script lang="ts">
  import { gameState } from '../state.svelte'
  let { letters, edit } = $props();
</script>

<button class="word" onclick="{() => gameState.defWord = letters}">
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
</button>

<style>
  .word {
    display: flex;
    margin: 0 auto;
    gap: 3px;
    border-radius: var(--border-radius-medium);
    padding: 3px;
    border: 1px solid  var(--border-color-light);
  }

  .letter {
    height: 24px;
    width: 24px;
    border-radius: var(--border-radius-small);
    border: 1px solid var(--border-color-light);
    background-color: var(--background-color-light);
    color: var(--black);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.1rem;
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
    border: solid 1px transparent;
    border-radius: var(--border-radius-small);;
    background-image: linear-gradient(var(--degs), #FFF0EF, var(--background-color-light)),
      linear-gradient(var(--degs), #FFB9B8, var(--border-color-light));
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
