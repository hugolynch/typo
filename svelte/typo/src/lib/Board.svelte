<script lang="ts">
  import { onMount } from "svelte";
  import Word from "./Word.svelte";

  let wordList: { word: string, seed: boolean }[] = [];
  let startChain: string[] = $state([]);
  let endChain: string[] = $state([]);
  let newWord = $state("");
  let gameOver = $derived(startChain.at(-1) === endChain.at(-1));

  onMount(async () => {
    wordList = await fetch('public/words.json').then(x => x.json());
    let seedWords = wordList.filter(word => word.seed)
    startChain.push(seedWords[Math.floor(Math.random() * seedWords.length)].word);
    endChain.push(seedWords[Math.floor(Math.random() * seedWords.length)].word);
  });

  //FOR DEBUGGING
  // startChain.push("STARE");
  // endChain.push("RUTS");
  console.log($state.snapshot(startChain[0]) + " / "  + $state.snapshot(endChain[0]));
  $inspect(gameOver);

  function submit(event: KeyboardEvent) {
    if (event.key === "Enter") {
      let currentWord = newWord.toUpperCase().trim();
      let startCompare = compareWords(startChain[startChain.length - 1], currentWord)
      let endCompare = compareWords(endChain[endChain.length - 1], currentWord)

      if ((startCompare.type === "same" || startCompare.type === "invalid") && (endCompare.type === "same" || endCompare.type === "invalid")) {
        console.log(`%c${startChain[startChain.length - 1]}` + " → " + currentWord + " : " + startCompare.type, 'color: #DC6B6E; background: #FFF0EF');
        console.log(`%c${endChain[endChain.length - 1]}` + " → " + currentWord + " : " + endCompare.type, 'color: #DC6B6E; background: #FFF0EF');
      }
      
      if (startCompare.type !== "same" && startCompare.type !== "invalid") {
        console.log(`%c${startChain[startChain.length - 1]}` + " → " + currentWord + " : " + startCompare.type, 'color: #579E47; background: #EDF5EB')
        startChain.push(currentWord);
        newWord = "";
      }
      
      if (endCompare.type !== "same" && endCompare.type !== "invalid") {
        console.log(`%c${endChain[endChain.length - 1]}` + " → " + currentWord + " : " + endCompare.type, 'color: #579E47; background: #EDF5EB')
        endChain.push(currentWord);
        newWord = "";
      }
    }
  }

  function isInsertion(a: string, b: string): number | null {
    let i = 0,
      j = 0,
      diff = 0;
    let index: number | null = null;

    while (j < b.length) {
      if (a[i] === b[j]) {
        i++;
        j++;
      } else {
        index = j++;
        diff++;
      }
    }
    return diff === 1 ? index : null
  }

  function compareWords(a: string, b: string) {
    let index: number | null = null;
    if (a.length === b.length) {
      if (a === b) {
        return { index, type: "same" }
      }

      if ([...a].sort().join("") === [...b].sort().join("")) {
        return { index, type: "shuffle" };
      }

      let diff = 0;
      for (let i = 0; i < a.length; i++) {
        if (a[i] != b[i]) {
          diff++;
          index = i;
        }
      }

      if (diff === 1) {
        return { index, type: "substitution" };
      }

    } else if (a.length < b.length) {
      if ((index = isInsertion(a, b)) !== null) {
        return { index, type: "insertion" }
      }
    } else { // a.length > b.length
      if ((index = isInsertion(b, a)) !== null) {
        return { index, type: "deletion" }
      }
    }

    return { index: null, type: "invalid" }
  }
</script>

<div class="chain">
  {#each startChain as word, index}
    {#if index === 0}
    <Word letters={word} edit={{ index: null, type: "start"}} />
    <div class="direction">↓</div>
    {:else}
      <Word letters={word} edit={compareWords(startChain[index - 1], word)} />
    {/if}
  {/each}
</div>

{#if gameOver}
  <hr class="line"/>
{:else}
  <input bind:value={newWord} onkeydown={submit} disabled={!(startChain.length && endChain.length)} />
{/if}

<div class="chain">
  {#each endChain.toReversed() as word, index}
    {#if index === endChain.length - 1}
    <div class="direction">↑</div>
    <Word letters={word} edit={{ index: null, type: "start"}} />
    {:else if !gameOver || index}
      <Word letters={word} edit={compareWords(endChain.toReversed()[index + 1], word)} />
    {/if}
  {/each}
</div>

<style>
  .chain {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  input {
    padding: 0 8px;
    border: 1px solid var(--border-color-light);
    text-transform: uppercase;
    font-family: monospace;
    text-align: center;
  }

  input {
    height: 32px;
    border-radius: var(--border-radius-medium);
    font-family: monospace;
    text-transform: uppercase;
    letter-spacing: 1rem;
    text-align: center;

    &:focus {
        border: 1px solid var( --black);
        outline: none;
    }
  }

  .direction {
      font-weight: bold;
  }

  .line {
    width: 400px;
    height: 1px;
    background: linear-gradient(90deg, white 10%, var(--border-color-light), white 90%);
    border: none;
    margin: 1px 0;
}

</style>
