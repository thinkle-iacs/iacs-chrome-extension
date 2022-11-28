<script lang="ts">
  export let mode: "HS" | "MS" | "Staff";
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
    {#if showAll || i < 3}
      <div
        class:block-2={i == 0}
        class:block-3={i == 1}
        class:block-4={i == 2}
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
    align-items: stretch;
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
    box-sizing: content-box;
  }
  img {
    max-height: 64px;
  }
  .prev {
    opacity: 0.55;
  }

  .time {
    color: var(--darkgrey);
    font-size: var(--big);
  }
  @media screen and (max-width: 1400px) {
    .block-4 {
      display: none;
    }
  }
  @media screen and (max-width: 1100px) {
    .block-3 {
      display: none;
    }
  }
  @media screen and (max-width: 800px) {
    .block-2 {
      display: none;
    }
  }
</style>
