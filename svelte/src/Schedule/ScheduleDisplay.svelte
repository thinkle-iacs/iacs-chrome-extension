<script lang="ts">
  import ScheduleChooser from "./ScheduleChooser.svelte";
  import { now } from "./now";
  import ScheduleBlockDisplay from "./ScheduleBlockDisplay.svelte";
  import { fly, fade } from "svelte/transition";
  import { onMount } from "svelte";

  import Menu from "../Menu.svelte";
  import { getBlock, ScheduleBlock } from "./schedule";
  import { hs_schedule } from "./hs_schedule";
  let schedule = hs_schedule;
  let activeOption = { schedule };
  $: schedule = activeOption?.schedule;
  let today = $now.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  let {
    currentBlock,
    previousBlock,
    nextBlocks,
  }: {
    currentBlock: ScheduleBlock;
    previousBlock: ScheduleBlock;
    nextBlocks: ScheduleBlock[];
  } = getBlock($now, schedule);

  $: {
    ({ currentBlock, previousBlock, nextBlocks } = getBlock($now, schedule));
  }

  let showAll;
  function setActive(option) {
    activeOption = option;
  }
</script>

<div class="blocks">
  <ScheduleChooser onChange={setActive} />
  <!-- <div class="prev">
      {#if previousBlock}
        <ScheduleBlockDisplay block={previousBlock} />
      {:else}
        …{/if}
    </div> -->
  <div class="current">
    {#if currentBlock}
      <ScheduleBlockDisplay
        block={currentBlock}
        bold={true}
        hideDay={currentBlock.day == $now.getDay()}
        horizontal={true}
      />
    {:else}…{/if}
  </div>

  {#each nextBlocks as nextBlock, i}
    {#if showAll || i < 2}
      <div
        class={`next next-${i}`}
        in:fly|local={{ x: 500 }}
        out:fly|local={{ x: 500 }}
      >
        <ScheduleBlockDisplay
          block={nextBlock}
          horizontal={true}
          hideDay={currentBlock.day == $now.getDay()}
        />
      </div>
    {/if}
  {:else}
    <div class="next">…</div>
  {/each}
  <a href="#bell-schedule">🔔</a>
  {#if false && nextBlocks.length > 2}
    <button on:click={() => (showAll = !showAll)}>
      {#if showAll}
        ◀
      {:else}
        ▶
      {/if}
    </button>
  {/if}
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
    margin: var(--pad);
    height: 3em;
    min-width: 3em;
  }
  .blocks .current {
    border-bottom: 3px solid var(--red);
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
