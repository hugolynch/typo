<script lang="ts">
  import { gameState } from '../state.svelte'

  let defPromise = $derived(async function(word: string | null) {
    let defs = await fetch(`https://en.wiktionary.org/api/rest_v1/page/definition/${word?.toLowerCase()}`)
      .then(response => response.json())
    let def = defs.en[0].definitions[0].definition
    let doc = new DOMParser().parseFromString(def, 'text/html')
    return [defs.en[0].partOfSpeech, doc.body.textContent]
  }(gameState.defWord))
</script>

{#if gameState.defWord}
  <footer>
    <div>
      {#await defPromise}
        Fetching definition...
      {:then def}
        <span class="word">{ gameState.defWord } /</span>
        <span class="speech">{ def[0] }</span>
        <span class="def">{ def[1] }</span>
      {/await}
    </div>
    <button class="close" onclick={() => gameState.defWord = null}>X</button>
  </footer>
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
    gap: 4px;

  }

  .word {
    /* display: block; */
    font-weight: bold;
  }

  .def {
    display: block;
    flex-grow: 1;

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
