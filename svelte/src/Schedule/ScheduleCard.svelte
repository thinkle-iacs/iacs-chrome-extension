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
  let customize = false;
  function togglePersonalize() {
    customize = !customize;
  }

  let customScheduleStuff = {};
  let dayToShow = $now.getDay();

  function changeDayToShow(delta, recursionCount = 0) {
    dayToShow = (dayToShow + delta + 7) % 7;
    if (!byDay[dayToShow] && recursionCount < 7) {
      changeDayToShow(delta, recursionCount + 1);
    }
  }
</script>

<Card double={true} fullwidth={customize}>
  <div
    id="bell-schedule"
    slot="head"
    style="display:flex;justify-content:space-between;align-items:center;width:100%;"
  >
    <div
      style="display: flex; justify-content: start; align-items: center;gap:var(--pad);"
    >
      <h2>Bell Schedule</h2>
      <button on:click={togglePersonalize} class:active={customize}>
        Personalize</button
      >
    </div>

    <div class="row">
      {#if !customize}
        <ScheduleChooser onChange={setActive} showUpdate={true} />
      {:else}
        <em>Edit Mode</em>
      {/if}
    </div>
  </div>
  <div slot="body">
    <div class="controls">
      <button on:click={() => changeDayToShow(6)}>←</button>
      <button on:click={() => changeDayToShow(1)}>→</button>
    </div>
    <div
      class="schedule-grid"
      style:grid-template-rows={`repeat(${60 * 24},auto)`}
      style:grid-template-columns="2em auto"
    >
      {#each [8, 9, 10, 11, 12, 13, 14, 15] as hour}
        <div
          class="hour-block"
          style={getGridStyle({
            day: 0,
            start: `${hour}:00`,
            end: `${hour + 1}:00`,
          })}
        >
          {#if hour < 13}
            {hour}am
          {:else}
            {hour - 12}pm
          {/if}
        </div>
      {/each}

      {#each days as day, n}
        {#if byDay[n]}
          <div
            class:today={$now.getDay() == n}
            class="dayheader"
            style:grid-row-start="1"
            style:grid-row-end="2"
            style:grid-column-start={n + 1}
            style:grid-column-end={n + 1}
            class:highlight={n == dayToShow}
            class:next-to-highlight={Math.abs(n - dayToShow) == 1}
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
            class="block-container"
            class:highlight-block={dayToShow == block.day}
            class:next-to-highlight-block={Math.abs(block.day - dayToShow) == 1}
            class:current={block == currentBlock}
            class:next={nextBlocks && nextBlocks.indexOf(block) > -1}
            class:previous={previousBlock == block}
          >
            <ScheduleBlockDisplay
              {customize}
              {block}
              heightMode={true}
              hideDay={true}
            />
          </div>
        {/each}
      {/if}
    </div>
  </div>
  <div slot="footer">
    {#if activeOption?.url}
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
    color: var(--white, "white");
    text-align: center;
    padding: var(--pad);
    border-right: 1px solid var(--white, "white");
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
    font-weight: var(--bold);
    background-color: var(--blue);
  }
  .row {
    display: flex;
    justify-content: end;
    align-items: center;
    gap: var(--pad);
  }
  button.active {
    background-color: var(--darkgrey);
    color: var(--white);
  }
  .hour-block {
    display: grid;
    place-content: start center;
    font-size: var(--tiny);
  }
  .controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--pad);
    padding: var(--pad);
  }
  .controls {
    display: none;
  }
  @media (max-width: 800px) {
    .controls {
      display: flex;
    }
    /* Three day display */
    .dayheader,
    .block-container {
      display: none;
    }
    .dayheader.highlight,
    .highlight-block {
      display: block;
      grid-column-start: 1;
      grid-column-end: 2;
    }
    .dayheader.next-to-highlight,
    .next-to-highlight-block {
      display: block;
      grid-column-start: 2;
      grid-column-end: 3;
    }
  }
  @media (max-width: 550px) {
    .dayheader.next-to-highlight,
    .next-to-highlight-block {
      display: none;
    }
    .dayheader.highlight,
    .highlight-block {
      grid-column-start: 1;
      grid-column-end: 2;
    }
  }
</style>
