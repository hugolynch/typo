<script lang="ts">
  import Board from './lib/Board.svelte'
  import Nav from './lib/Nav.svelte'
</script>

<Nav />
<main>
  <img id="logo" alt="Typo logo" src="/img/logo-typo.svg">
  <div class="board">
    <Board />
  </div>
</main>

<style>
  
  main {
    display: flex;
    flex-direction: column;
    max-width: 1280px;
    gap: 32px;
    align-items: center;
  }

  .board {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  #logo {
    max-width: 200px;
    margin: 0 auto;
  }
</style>