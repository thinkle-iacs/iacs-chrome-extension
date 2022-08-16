<script lang="ts">
  import Card from "../Card.svelte";
  import { getOffsetFromTime } from "./schedule";
  import ScheduleBlockDisplay from "./ScheduleBlockDisplay.svelte";
  import ScheduleChooser from "./ScheduleChooser.svelte";
  import ScheduleDisplay from "./ScheduleDisplay.svelte";
  let activeOption;
  function setActive(scheduleOption) {
    activeOption = scheduleOption;
  }
  let earliestTime = 24 * 60;
  let latestTime = 0;
  let byDay = {};
  let byDayByMinute = {};
  let minutes: number[] = [];
  $: {
    if (activeOption?.schedule) {
      byDay = {};
      for (let block of activeOption.schedule) {
        if (!byDay[block.day]) {
          byDay[block.day] = true;
        }
      }
    }
  }
  const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

  const numRows = minutes.length + 1;
  const numCols = days.length;

  function getGridStyle(block) {
    let colStart = block.day + 1;
    let colEnd = block.day + 2;
    let startOffset = getOffsetFromTime(block.start);
    let endOffset = getOffsetFromTime(block.end);
    return `
      grid-row-start : ${startOffset};
      grid-row-end: ${endOffset};
      grid-column-start : ${colStart};
      grid-column-end: ${colEnd};
    `;
  }
</script>

<Card>
  <div slot="head">
    <h2>Bell Schedule</h2>
    <ScheduleChooser onChange={setActive} />
  </div>
  <div slot="body">
    <div
      class="schedule-grid"
      style:grid-template-rows={`repeat(${60 * 24},auto)`}
      style:grid-template-columns={`repeat(${numCols},auto)`}
    >
      {#each days as day, n}
        {#if byDay[n]}
          <div
            class="dayheader"
            style:grid-row-start="1"
            style:grid-row-end="2"
            style:grid-column-start={n + 1}
            style:grid-column-end={n + 2}
          >
            {day}
          </div>
        {/if}
      {/each}
      {#each activeOption.schedule as block}
        <div style={getGridStyle(block)}>
          <ScheduleBlockDisplay {block} heightMode={true} hideDay={true} />
        </div>
      {/each}
    </div>
  </div>
</Card>

<style>
  .schedule-grid {
    display: grid;
  }

  .dayheader {
    background-color: var(--darkgrey);
    color: white;
    text-align: center;
    padding: var(--pad);
    border-right: 1px solid white;
  }
</style>
