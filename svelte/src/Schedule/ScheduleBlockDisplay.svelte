<script lang="ts">
  export let bold = false;
  import type { ScheduleBlock } from "./schedule";
  export let block: ScheduleBlock;
  const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  import { formatTime } from "./schedule";
</script>

<div class="block" class:bold>
  <div class="block-title">{block.name}</div>
  <div class="time">
    {#if block.day}<span class="day">{days[block.day]}</span>{/if}
    {#if block.start && block.end}
      <span class="times">
        {formatTime(block.start)}&ndash;{formatTime(block.end)}
      </span>
    {/if}
  </div>
</div>

<style>
  .block {
    color: var(--darkgrey);
    font-weight: var(--thick);
  }
  .block-title {
    font-size: 110%;
  }
  .day {
    font-size: 70%;
  }
  .times {
    font-size: 50%;
  }
  .bold .times {
    font-size: 80%;
  }

  .bold {
    color: black;
    background-color: var(--darkgrey);
    color: white;
    font-weight: var(--skinny);
  }
</style>
