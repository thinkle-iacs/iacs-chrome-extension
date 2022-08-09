<script lang="ts">
  import ScheduleBlockDisplay from "./Schedule/ScheduleBlockDisplay.svelte";
  import { fly, fade } from "svelte/transition";
  import { onMount } from "svelte";

  import Menu from "./Menu.svelte";
  import { getHSBlock, ScheduleBlock } from "./Schedule/schedule";

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
  } = getHSBlock(new Date());

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
      let hsinfo = getHSBlock(now);
      currentBlock = hsinfo.currentBlock;
      nextBlocks = hsinfo.nextBlocks;
      previousBlock = hsinfo.previousBlock;
    }, 1000);
  });
  let showAll;
</script>

<div class="rows">
  <div class="time">{today}</div>
  <div class="blocks">
    <a
      href="https://docs.google.com/document/d/1E5J9z_fa_PHb-xvwR1W0NvGeV1kGUbgAg-wcvg9bXIQ/edit"
      >HS🔔</a
    >
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
