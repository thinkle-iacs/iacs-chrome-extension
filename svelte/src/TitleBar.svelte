<script lang="ts">
  import TimeDisplay from "./TimeDisplay.svelte";

  import Menu from "./Menu.svelte";
</script>

<div>
  <img src="./icons/IACS_logo.png" />
  <h1>IACS Launcher</h1>
  <TimeDisplay />
</div>

<style>
  @media screen and (max-width: 1000px) {
    h1 {
      display: none;
    }
  }
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  @media screen and (max-width: 800px) {
    div {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  img {
    max-height: 64px;
  }

  h1 {
    color: var(--blue);
    text-decoration: underline;
    text-decoration-color: var(--red);
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
    margin: 0;
  }
</style>
