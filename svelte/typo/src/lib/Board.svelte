<script lang="ts">
  import Word from "./Word.svelte";
  let startChain: string[] = $state([]);
  let endChain: string[] = $state([]);
  let newWord = $state("");

  startChain.push("START");
  endChain.push("ENDING");

  function submit(event: KeyboardEvent) {
    if (event.key === "Enter") {
      newWord = newWord.toUpperCase().trim();
      
      let startCompare = compareWords(startChain[startChain.length - 1], newWord)
      if (startCompare.type !== "same" && startCompare.type !== "invalid") {
        startChain.push(newWord);
        newWord = "";
      }

      // let endCompare = compareWords(endChain[endChain.length - 1], newWord)
      // if (endCompare.type !== "same" && endCompare.type !== "invalid") {
      //   endChain.push(newWord);
      //   newWord = "";
      // }

      console.log(startCompare)

    }
  }

  function isInsertion(a: string, b: string): number | null {
    console.log(a, b)

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
    console.log(index, diff)
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
    } else { // a.length < b.length
      if ((index = isInsertion(b, a)) !== null) {
        return { index, type: "deletion" }
      }
    }

    return { index: null, type: "invalid" }
  }
</script>

<div class="chain">
  {#each startChain as word}
    <Word letters={word} />
  {/each}
</div>

<input bind:value={newWord} onkeydown={submit} />

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
