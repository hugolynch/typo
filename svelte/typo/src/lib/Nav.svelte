<script lang="ts">

</script>

<nav>
  <div class="row">
    <a>LOGO</a>
    <a>Trèfle</a>
    <div class="spacer"></div>
    <ul>User ⏷</ul>
  </div>
  <div class="row">
    <a>←</a>
    <div>Typo</div>
    <ul>Game Mode ⏷</ul>
  </div>
  <div class="row">
    <ul>Options ⏷</ul>
    <div class="spacer"></div>
    <button>?</button>
    <button>Share</button>
    <a>Leaderboards</a>
  </div>
</nav>

<style>
  nav {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
    border-bottom: 1px solid var(--border-color-light);
    background-color: var(--background-color-light);
    width: 100%;
  }

 .row {
  display: flex;
  gap: 8px;

  &>* {
    display: flex;
    height: 32px;
    border: 1px solid var(--border-color-light);
    border-radius: var(--border-radius-small);
    font-size: 1.6rem;
    align-items: center;
    padding: 0 8px;
    background-color: white;
  }

  &>.spacer {
    flex-grow: 1;
    border: none;
    background-color: transparent;
  }
 }
</style>