<script lang="ts">
  import Board from './lib/Board.svelte'
</script>

<main>
  <img alt="Typo logo" src="/img/logo-typo.svg">
</main>

<div class="board">
  <Board />
</div>

<style>
  main {
    border: 1px solid red;
  }

  .board {
    border: 1px solid green;
  }
</style>
