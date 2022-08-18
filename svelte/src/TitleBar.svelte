<script lang="ts">
  import TimeDisplay from "./TimeDisplay.svelte";

  import Menu from "./Menu.svelte";
</script>

<div class="top">
  <div class="logo-block">
    <img src="./icons/IACS_logo.png" />
    <h1>Launcher</h1>
  </div>
  <TimeDisplay />
</div>

<style>
  @media screen and (max-width: 1100px) {
    h1 {
      display: none;
    }
  }
  .top {
    display: flex;
    flex-direction: row;
    align-items: end;
    justify-content: space-between;
    border-bottom: 3px solid var(--red);
    margin-bottom: calc(2 * var(--pad));
    margin-left: var(--pad);
    margin-right: var(--pad);
  }

  h1 {
    color: var(--blue);
    text-transform: uppercase;
    font-size: var(--huge);
    font-weight: 100;
    margin: 0;
  }
  img {
    height: var(--huge);
  }
  .logo-block {
    display: flex;
    gap: var(--pad);
    justify-content: start;
    align-items: center;
  }
  @media screen and (max-width: 800px) {
    .logo-block {
      display: none;
    }
    .top,
    .top :global(*) {
      flex-wrap: wrap;
    }
  }
</style>
