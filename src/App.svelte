<script lang="ts">
  import logo from '/img/logo-typo.svg'
  import Nav from './lib/Nav.svelte'
  import Board from './lib/Board.svelte'
  import Definition from './lib/Definition.svelte'
</script>

<div id="game">
  <img id="logo" alt="Typo logo" src="{logo}">
  <Board />
  <Definition />
</div>

<style>
  #logo {
    max-width: 200px;
    margin: 32px auto 0;
  }

  #game {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-items: center;
    height: 100vh;
  }
</style>