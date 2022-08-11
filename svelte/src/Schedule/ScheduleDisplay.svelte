<script lang="ts">
  import ScheduleChooser from "./ScheduleChooser.svelte";
  export let now: Date;
  import ScheduleBlockDisplay from "./ScheduleBlockDisplay.svelte";
  import { fly, fade } from "svelte/transition";
  import { onMount } from "svelte";

  import Menu from "../Menu.svelte";
  import {
    getBlock,
    ScheduleBlock,
    hs_schedule,
    ms_56_ela,
    ms_78_ela,
    ms_56_a,
    ms_78_a,
  } from "./schedule";
  let schedule_options = [
    {
      name: "HS",
      url: "https://docs.google.com/document/d/1E5J9z_fa_PHb-xvwR1W0NvGeV1kGUbgAg-wcvg9bXIQ/edit",
      schedule: hs_schedule,
    },
    {
      name: "5/6 (1)",
      url: "https://docs.google.com/document/d/1suZQXiTsE5QfTgKm1bRyB1fnQDV78WS6DB1c10iSB0c/edit",
      schedule: ms_56_a,
    },
    {
      name: "7/8 (2)",
      url: "https://docs.google.com/document/d/1suZQXiTsE5QfTgKm1bRyB1fnQDV78WS6DB1c10iSB0c/edit",
      schedule: ms_78_a,
    },
    {
      name: "5/6 (ELA)",
      url: "https://docs.google.com/document/d/1suZQXiTsE5QfTgKm1bRyB1fnQDV78WS6DB1c10iSB0c/edit",
      schedule: ms_56_ela,
    },
    {
      name: "7/8 (ELA)",
      url: "https://docs.google.com/document/d/1suZQXiTsE5QfTgKm1bRyB1fnQDV78WS6DB1c10iSB0c/edit",
      schedule: ms_78_ela,
    },
  ];

  let schedule = ms_56_ela;
  let activeOption = schedule_options[0];
  $: schedule = activeOption.schedule;
  let today = new Date().toLocaleString("en-US", {
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
  } = getBlock(now, schedule);

  $: {
    ({ currentBlock, previousBlock, nextBlocks } = getBlock(now, schedule));
  }

  let showAll;
  function setActive(option) {
    activeOption = option;
  }
</script>

<div class="blocks">
  <ScheduleChooser onChange={setActive} />
  <a href={activeOption.url}> {activeOption.name}🔔</a>
  <!-- <div class="prev">
      {#if previousBlock}
        <ScheduleBlockDisplay block={previousBlock} />
      {:else}
        …{/if}
    </div> -->
  <div class="current">
    {#if currentBlock}
      <ScheduleBlockDisplay block={currentBlock} bold={true} />
    {:else}…{/if}
  </div>

  {#each nextBlocks as nextBlock, i}
    {#if showAll || i < 2}
      <div
        class={`next next-${i}`}
        in:fly|local={{ x: 500 }}
        out:fly|local={{ x: 500 }}
      >
        <ScheduleBlockDisplay block={nextBlock} />
      </div>
    {/if}
  {:else}
    <div class="next">…</div>
  {/each}
  {#if nextBlocks.length > 2}
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
