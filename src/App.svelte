<script lang="ts">
  import logo from './assets/img/logo-typo.svg'
  import Nav from './lib/Nav.svelte'
  import Board from './lib/Board.svelte'
  import Definition from './lib/Definition.svelte'
</script>

<Nav />
<img id="logo" alt="Typo logo" src="{logo}">
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