<script lang="ts">
  import Board from './lib/Board.svelte'
  import Nav from './lib/Nav.svelte'
</script>

<Nav />
<img id="logo" alt="Typo logo" src="/img/logo-typo.svg">
<div class="board">
  <Board />
</div>
<div id="def">lakdmla</div>

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

  #def {
  border: 1px solid red;
  background-color: var(--black);
  color: white;
  padding: 32px;
  width: 100%;
  font-family: monospace;
  font-size: 1.2rem;
}
</style>