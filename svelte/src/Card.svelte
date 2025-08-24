<script lang="ts">
  import { activeCardIDs, hiddenCards } from "./prefs";
  import type { SchoolType } from "./prefs";
  import { school as schoolPref } from "./prefs";
  import CloseButton from "./CloseButton.svelte";
  export let bare = false;
  export let fullwidth = false;
  export let double = false;
  export let small = false;
  export let id: string = null;
  export let school: SchoolType = null;
  export let temp = false;

  function hideCard() {
    $hiddenCards[id] = true;
  }

  function registerId(id) {
    if (id) {
      if ($activeCardIDs.indexOf(id) == -1) {
        $activeCardIDs = [...$activeCardIDs, id];
      }
    }
  }

  let rightSchool = false;
  $: if (
    $schoolPref &&
    school &&
    $schoolPref != school &&
    $schoolPref != "All"
  ) {
    rightSchool = false;
  } else {
    rightSchool = true;
  }

  $: if (rightSchool && !temp) {
    registerId(id);
  }
</script>

{#if rightSchool}
  {#if !id || !$hiddenCards[id]}
    <div
      class="card"
      class:bare
      class:double
      class:small
      class:fullwidth
      on:click
    >
      <div class="head">
        <slot name="head" />
        {#if id}<div class="pad-left">
            <CloseButton on:click={hideCard}>&times;</CloseButton>
          </div>
        {/if}
      </div>
      <div class="body">
        <slot name="body" />
      </div>
      <div class="footer">
        <slot name="footer" />
      </div>
    </div>
  {/if}
{/if}

<style>
  .card {
    display: flex;
    flex-direction: column;
    /* max-width: calc(min(800px, 45vw));
    min-width: calc(max(250px, 30vw)); */
    box-shadow: 0 4px 8px 0 var(--darkshadow);
    border-radius: 16px;
    padding: var(--pad);
    grid-column-start: span 2;
    background-color: var(--off-white);
  }
  .card.double {
    grid-column-start: span 4;
  }
  .card.fullwidth {
    grid-column-start: span 8;
  }

  .card.small {
    grid-column-start: span 1;
  }

  .head,
  .footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .head,
  .footer,
  .body {
    padding: calc(2 * var(--pad, 4px));
    box-sizing: border-box;
  }
  .head {
    border-bottom: 1px solid var(--lightgrey);
    min-height: var(--bar-height);
  }
  .footer {
    border-top: 1px solid var(--lightgrey);
    min-height: var(--bar-height);
  }
  .pad-left {
    margin-left: var(--pad);
  }
  .bare {
    border: none;
    box-shadow: none;
  }
  .bare * {
    border: none;
  }
  .card {
    max-width: var(--max-card-width);
  }
  .card :global(img) {
    max-width: calc(100% - 2 * var(--pad));
  }
  .card :global(table) {
    max-width: 100%;
    overflow-x: auto;
    display: block;
  }
  .card {
    word-break: break-word;
  }
</style>
