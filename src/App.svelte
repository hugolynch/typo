<script lang="ts">
  import Nav from './lib/Nav.svelte'
  import Board from './lib/Board.svelte'
  import Definition from './lib/Definition.svelte'
</script>

<Nav />
<img id="logo" alt="Typo logo" src="/img/logo-typo.svg">
<div class="board">
  <Board />
</div>
<Definition />

<style>
  .board {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex-grow: 1;
  }

  #logo {
    max-width: 200px;
    margin: 0 auto;
  }
</style>