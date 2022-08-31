<script lang="ts">
  export let block: ScheduleBlock;

  import {
    customSchedule,
    getCustomBlockName,
    selectedSchedule,
  } from "../prefs";

  function setupCustom(newSched) {
    let newCustom = $customSchedule[newSched];
    if (!newCustom) {
      newCustom = {};
    }
    if (!newCustom.byDay) {
      newCustom.byDay = {
        0: {},
        1: {},
        2: {},
        3: {},
        4: {},
        5: {},
        6: {},
      };
    }
    if (!newCustom.byBlock) {
      newCustom.byBlock = {};
    }
    $customSchedule[newSched] = newCustom;
    $customSchedule = $customSchedule;
  }

  setupCustom($selectedSchedule);

  let linkedMode = true;
</script>

<div class="bar">
  {#if linkedMode}
    <input
      type="text"
      bind:value={$customSchedule[$selectedSchedule].byBlock[block.name]}
    />
  {:else}
    <input
      type="text"
      bind:value={$customSchedule[$selectedSchedule].byDay[block.day][
        block.name
      ]}
    />
  {/if}
  <label class:active={linkedMode}>
    🔗<input
      style="display:none"
      type="checkbox"
      bind:checked={linkedMode}
    /></label
  >
</div>

<style>
  .bar {
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    align-items: center;
  }

  label {
    opacity: 0.3;
  }
  label.active {
    opacity: 1;
  }
</style>
