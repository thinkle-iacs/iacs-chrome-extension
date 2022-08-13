<script lang="ts">
  export let bold = false;
  import type { ScheduleBlock } from "./schedule";
  export let block: ScheduleBlock;
  const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  import { formatTime } from "./schedule";
  export let hideDay = false;
</script>

<div class="block" class:bold>
  <div class="block-title">{block.name}</div>
  <div class="time">
    {#if !hideDay && block.day}<span class="day">{days[block.day]}</span>{/if}
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
    padding: var(--pad);
    border: 1px solid var(--darkgrey);
  }
  .block-title {
    font-size: 110%;
    text-align: center;
  }
  .day {
    font-size: 70%;
  }
  .times {
    font-size: 50%;
    white-space: nowrap;
  }
  .bold .times {
    font-size: 80%;
  }

  .bold {
    font-weight: var(--thick);
  }
</style>
