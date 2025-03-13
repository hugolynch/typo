<script lang="ts">
  import wordsUrl from '../../public/words.json?url'
  import { onMount } from "svelte";
  import { solve } from '../solver'
  import Word from "./Word.svelte";

  let wordList: { word: string, seed: boolean }[] = [];
  let solution: string[]|null = $state(null);
  let startChain: string[] = $state([]);
  let endChain: string[] = $state([]);
  let newWord = $state("");
  let gameOver = $derived(startChain.at(-1) === endChain.at(-1));

  onMount(async () => {
    wordList = await fetch(wordsUrl).then(x => x.json());
    const neighbours = await fetch('./computed.txt')
      .then(r => r.text())
      .then(text => {
        const lines = text.split(/\r?\n/);
        const moves = new Map<string, string[]>();
        for (const line of lines) {
          const [word, ...valid] = line.split(/[:,]/);
          moves.set(word, valid); // each move costs one for now
        }
        return moves;
      })

    let seedWords = wordList.filter(word => word.seed)
    startChain.push(seedWords[Math.floor(Math.random() * seedWords.length)].word);
    endChain.push(seedWords[Math.floor(Math.random() * seedWords.length)].word);
    solution = solve(startChain[0], endChain[0], neighbours)
    console.log($state.snapshot(startChain[0]) + " / "  + $state.snapshot(endChain[0]));
    if (! solution) {
      console.log('%cNO SOLUTION', 'color: #DC6B6E; background: #FFF0EF');
    }
  });

  //FOR DEBUGGING
  // startChain.push("MANATEE");
  // endChain.push("RUTS");

  function submit(event: KeyboardEvent) {
    if (event.key === "Enter") {
      let currentWord = newWord.toUpperCase().trim();
      newWord = "";

      if (wordList.every(word => word.word !== currentWord)) {
        console.log("%cINVALID WORD", 'color: #DC6B6E; background: #FFF0EF');
        return;
      }

      let startCompare = compareWords(startChain[startChain.length - 1], currentWord)
      let endCompare = compareWords(endChain[endChain.length - 1], currentWord)
      console.log(startChain.at(-1) + " → " + currentWord + " : " + startCompare.type + '\n' + endChain.at(-1) + " → " + currentWord + " : " + endCompare.type);

      if ((startCompare.type === "same" || startCompare.type === "invalid") && (endCompare.type === "same" || endCompare.type === "invalid")) {
      }
      
      if (startCompare.type !== "same" && startCompare.type !== "invalid") {
        startChain.push(currentWord);
      }
      
      if (endCompare.type !== "same" && endCompare.type !== "invalid") {
        endChain.push(currentWord);
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
      <Word letters={word} edit={{ index: null, type: "start" }} />
      <div class="direction">↓</div>
    {:else}
      <div class="row">
        <Word letters={word} edit={compareWords(startChain[index - 1], word)} />
        {#if index === startChain.length - 1 && !gameOver}
          <button onclick={() => startChain.pop()}>X</button>
        {/if}
      </div>
    {/if}
  {/each}
</div>

{#if gameOver}
  <hr class="line"/>
  {console.log($state.snapshot(solution))}
  {console.log('SCORE:', Math.round(solution?.length as number / (endChain.length + startChain.length - 1) * 100) )}
{:else}
  <input bind:value={newWord} onkeydown={submit} disabled={!(startChain.length && endChain.length)} />
{/if}

<div class="chain">
  {#each endChain.toReversed() as word, index}
    {#if index === endChain.length - 1}
      <div class="direction">↑</div>
      <Word letters={word} edit={{ index: null, type: "start"}} />
    {:else if !gameOver || index}
      <div class="row">
        <Word letters={word} edit={compareWords(endChain.toReversed()[index + 1], word)} />
        {#if index === 0}
          <button onclick={() => endChain.pop()}>X</button>
        {/if}
      </div>
    {/if}
  {/each}
</div>

<style>
  .chain {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  input {
    height: 32px;
    padding: 0 8px;

    border: 1px solid var(--border-color-light);
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

  .row {
    display: flex;
    align-items: center;
    position: relative;
    gap: 4px;
  }

  button {
    height: 24px;
    width: 24px;
    border-radius: var(--border-radius-small);
    border: none;
    background-color: white;
    color: var(--black);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    font-family: var(--open-runde);

    position: absolute;
    left: calc(100% + 4px);

    &:hover {
      background-color: var(--background-color-light);
    }
  }

  .line {
    width: 400px;
    height: 1px;
    background: linear-gradient(90deg, white 10%, var(--border-color-light), white 90%);
    border: none;
    margin: 1px 0;
}
</style>
