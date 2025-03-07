<script lang="ts">
  let { letters }  = $props();
</script>

<div class="word">
{#each [...letters] as letter}
  <span class="letter">{ letter }</span>
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
</style>