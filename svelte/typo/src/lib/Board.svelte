<script lang="ts">
  import Word from "./Word.svelte"
  let startChain: string[] = $state([]);
  
  let endChain: string[] = []

  startChain.push("START")
  endChain.push("ENDING")

  let newWord = $state("")

  function submit(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      startChain.push(newWord.toUpperCase().trim())
      newWord = ""
    }
  }
</script>

<div class="chain">
  {#each startChain as word}
    <Word letters={ word } />
  {/each}
</div>

<input bind:value={ newWord } onkeydown={ submit }>

<div class="chain">
  {#each endChain.reverse() as word}
    <Word letters={word} />
  {/each}
</div>

<style>
  .chain {
    display: flex;
    flex-direction: column;
    gap: 4px;
    border: 1px solid yellow;
  }

  input {
    margin: 0;
    padding: 0;
    display: block;
    margin: 0 auto;
    text-transform: uppercase;
  }
</style>
