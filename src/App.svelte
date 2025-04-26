<script lang="ts">
  import logo from '/img/logo-typo.svg'
  import Nav from './lib/Nav.svelte'
  import Board from './lib/Board.svelte'
  import Definition from './lib/Definition.svelte'
</script>

<!-- <Nav /> -->
<main>
  <div id="game">
    <img id="logo" alt="Typo logo" src="{logo}">
    <div class="board">
      <Board />
    </div>
    <Definition />
  </div>

  <!-- <div class="sidebar">
    <div>Timer</div>
    <div>Score</div>
    <div>Words</div>
    <div class="spacer"></div>
    <img>
    <div>Share →</div>
    <div>Leaderboards</div>
    <div>Archive</div>
    <div>New Puzzle</div>
  </div> -->
</main>

<style>
  .board {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 32px;
    flex-grow: 1;
  }

  #logo {
    max-width: 200px;
    margin: 32px auto 0;
  }

  #game {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-items: center;
    /* padding: 32px; */
  }

  .sidebar {
    background-color: #FEFAFA;
    min-width: 300px;
    
    &>div {
      padding: 24px 32px;
      border: 1px solid red;
    }
  }

  main {
    display: flex;
    flex-grow: 1;
  }
</style>