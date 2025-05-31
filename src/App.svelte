<script lang="ts">
  import Board from './lib/Board.svelte'
</script>

<div id="game">
  <Board />
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
