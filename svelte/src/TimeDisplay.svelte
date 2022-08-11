<script lang="ts">
  import ScheduleDisplay from "./Schedule/ScheduleDisplay.svelte";

  import { fly, fade } from "svelte/transition";
  import { onMount } from "svelte";

  import Menu from "./Menu.svelte";

  let now = new Date();
  let today = now.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  onMount(() => {
    setInterval(() => {
      let now = new Date();
      today = now.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });
    }, 1000);
  });
  let showAll;
</script>

<div class="rows">
  <div class="time">{today}</div>
  <ScheduleDisplay {now} />
</div>

<style>
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
  }
  div.rows {
    flex-direction: column;
  }
  .blocks {
    justify-content: space-between;
  }
  .blocks div {
    border: 1px solid var(--lightgrey);
    margin: var(--pad);
    height: 3em;
    min-width: 3em;
  }
  .blocks .current {
    border-color: var(--red);
    background-color: var(--darkgrey);
    color: white;
  }
  img {
    max-height: 64px;
  }
  .prev {
    opacity: 0.55;
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
