<script lang="ts">
  import { slide } from 'svelte/transition'
  import { gameState } from '../state.svelte'

  let defPromise = $derived(async function(word: string | null) {
    let defs = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then(response => response.json())
    return [defs[0].phonetic, defs[0].meanings[0].partOfSpeech, defs[0].meanings[0].definitions[0].definition]
  }(gameState.defWord))
</script>

{#if gameState.defWord}
  {#await defPromise then def}
    <footer transition:slide|global>
      <div>
        <span class="word">{ gameState.defWord }</span>
        <span class="phonetic">{ def[0] }</span>
        <span class="speech">{def[1]}</span>
        <span class="def">{ def[2] }</span>
      </div>
    <button class="close" onclick={() => gameState.defWord = null}>X</button>
  </footer>
  {/await}
{/if}

<style>
  footer {
    background-color: var(--black);
    color: white;
    padding: 16px;
    width: 100%;
    font-family: monospace;
    font-size: 1.2rem;
    line-height: 1.6rem;
    display: flex;
    /* align-items: center; */
    justify-content: space-between;
    gap: 8px;
    border-top: 1px solid black;

  }

  .word {
    font-weight: bold;
  }

  .speech {
    font-style: italic;
  }

  .def {
    display: block;
    flex-grow: 1;
    margin-top: 1rem;
  }

  .close {
    height: 24px;
    min-width: 24px;
    border-radius: var(--border-radius-small);
    border: none;
    background-color: #2E2F38;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    font-family: var(--open-runde);

    &:hover {
      background-color: #494A54;
    }
  }
</style>
