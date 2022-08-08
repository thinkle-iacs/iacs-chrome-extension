<script lang="ts">
  import { onMount } from "svelte";

  import Menu from "./Menu.svelte";
  let today = new Date().toLocaleString();

  onMount(() => {
    setInterval(() => {
      today = new Date().toLocaleString();
    }, 1000);
  });
</script>

<div>
  <img src="./icons/IACS_logo.png" />
  <h1>IACS Launcher</h1>
  <div class="time">{today}</div>
</div>

<style>
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
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
  }
  .time {
    color: var(--darkgrey);
    font-size: 2em;
  }
</style>
