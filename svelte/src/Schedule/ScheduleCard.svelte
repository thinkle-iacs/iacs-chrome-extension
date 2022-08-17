<script lang="ts">
  import Card from "../Card.svelte";
  import { getBlock, getOffsetFromTime } from "./schedule";
  import ScheduleBlockDisplay from "./ScheduleBlockDisplay.svelte";
  import ScheduleChooser from "./ScheduleChooser.svelte";
  import { now } from "./now";
  let activeOption;
  function setActive(scheduleOption) {
    activeOption = scheduleOption;
  }
  let byDay = {};
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
  let currentBlock, nextBlocks, previousBlock;

  $: {
    if (activeOption && activeOption.schedule) {
      ({ currentBlock, nextBlocks, previousBlock } = getBlock(
        $now,
        activeOption.schedule
      ));
    }
  }
</script>

<Card>
  <div
    id="bell-schedule"
    slot="head"
    style="display:flex;justify-content:space-between;align-items:center;width:100%;"
  >
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
            class:today={$now.getDay() == n}
            class="dayheader"
            style:grid-row-start="1"
            style:grid-row-end="2"
            style:grid-column-start={n + 1}
            style:grid-column-end={n + 2}
          >
            <!-- {#if $now.getDay() == n}
              ▶
            {/if} -->
            {day}
          </div>
        {/if}
      {/each}
      {#if activeOption}
        {#each activeOption.schedule as block, n (`${n}${block.day}${block.name}${block.start}${block.end}`)}
          <div
            style={getGridStyle(block)}
            class:current={block == currentBlock}
            class:next={nextBlocks && nextBlocks.indexOf(block) > -1}
            class:previous={previousBlock == block}
          >
            <ScheduleBlockDisplay {block} heightMode={true} hideDay={true} />
          </div>
        {/each}
      {/if}
    </div>
  </div>
  <div slot="footer">
    {#if activeOption}
      <a href={activeOption.url}>Google Doc Version</a>
    {/if}
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
  /* .previous {
    border-left: 3px solid var(--lightgrey);
    border-right: 3px solid var(--lightgrey);
    border-top: 3px solid var(--lightgrey);
  }
 */
  .current {
    border: 3px solid var(--blue);
  }
  /* .next {
    border-left: 3px solid var(--blue);
    border-right: 3px solid var(--blue);
  } */
  .today {
    font-size: 110%;
    font-weight: bold;
    background-color: var(--blue);
  }
</style>
