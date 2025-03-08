<script lang="ts">
  import Board from './lib/Board.svelte'
</script>

<main>
  <img alt="Typo logo" src="/img/logo-typo.svg">
  <div class="board">
    <Board />
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .board {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
</style>