<script lang="ts">
  import ScheduleDisplay from "./Schedule/ScheduleDisplay.svelte";
  import { now } from "./Schedule/now";
  import { fly, fade } from "svelte/transition";
  import { onMount } from "svelte";

  import Menu from "./Menu.svelte";

  let today = $now.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  $: today = $now.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  let todayBrief: string;
  $: todayBrief = $now.toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  let showAll;
</script>

<div>
  <span class="time">{today}</span>
  <span class="time-brief">{todayBrief}</span>
  <ScheduleDisplay />
</div>

<style>
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--pad);
  }

  .time,
  .time-brief {
    color: var(--darkgrey);
    font-size: var(--big);
  }
  .time-brief {
    display: none;
  }
  @media screen and (max-width: 1300px) {
    .time {
      display: none;
    }
    .time-brief {
      display: inline;
    }
  }
</style>
