<script lang="ts">
  import logo from '../assets/img/logo-hop.svg'
  import user from '../assets/img/user.svg'
  import dropdown from '../assets/img/icons/dropdown.svg'
  import date from '../assets/img/icons/date.svg'
</script>

<nav>
  <div class="row top">
    <img id="logo" alt="Hopscotch logo" src="{logo}">
    <span id="hop">Hopscotch Games</span>
    <div class="spacer"></div>
    <div>
      <span id="user"><img alt="user icon" src="{user}"></span>
      <div>User</div>
      <img alt="dropdown icon" src="{dropdown}">
    </div>
  </div>
  <div class="row middle">
    <div class="item">←</div>
    <div class="item">
      <img alt="date icon" src="{date}">
      <span>Date</span>
      <img alt="dropdown icon" src="{dropdown}">
    </div>
    <div class="item">Game</div>
    <div class="item">Mode</div>
    <div class="spacer"></div>
    <div class="item">Score</div>
  </div>
</nav>

<style>
  nav {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

 .row {
  display: flex;
  padding: 16px 32px;
  gap: 8px;

  &>* {
    display: flex;
    height: 32px;
    font-size: 1.6rem;
    align-items: center;
  }

  &>.spacer {
    flex-grow: 1;
    border: none;
    background-color: transparent;
  }
 }

 #user {
  
  height: 28px;
  width: 28px;
  border: 1px solid #8C8E98;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  aspect-ratio: 1 / 1;


  &>img {
      border-radius: 100%;
      height: 24px;
    }
  }

 .top {
    background-color: white;
  }

  #hop {
    font-weight: bold;
  }

  .middle {
    background-color: var(--background-color-light);

    &>.item {
      background-color: #E3E5EF;
      padding: 8px;
      border-radius: var(--border-radius-small);

      &>span {
        padding-left: 8px;
      }
    }
  }

</style>