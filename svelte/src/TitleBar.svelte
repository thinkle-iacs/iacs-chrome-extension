<script lang="ts">
  import TimeDisplay from "./TimeDisplay.svelte";
  export let mode = "Staff";
  import Menu from "./Menu.svelte";
</script>

<div class="top">
  <div class="logo-block">
    <img src="./icons/IACS_logo.png" />
    <h1>Launcher <span class="mode">{mode}</span></h1>
  </div>
  <TimeDisplay {mode} />
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
    white-space: nowrap;
  }
  h1 .mode {
    text-transform: none;
    font-size: var(--normal);
  }
  img {
    height: var(--huge);
  }
  .logo-block {
    display: flex;
    gap: var(--pad);
    justify-content: center;
    align-items: center;
    height: calc(var(--huge)+var(--pad)+var(--pad));
    padding-bottom: var(--pad);
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

  @media (prefers-color-scheme: dark) {
    img {
      filter: grayscale(1) invert(1);
      -webkit-filter: grayscale(1) invert(1);
    }
  }
</style>
