<script lang="ts">
  export let block: ScheduleBlock;

  import {
    customColors,
    customSchedule,
    getCustomBlockName,
    selectedSchedule,
  } from "../prefs";
  import ColorPicker from "./ColorPicker.svelte";

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

<div class="form">
  {#if linkedMode}
    <label>Name</label>
    <input
      class="input"
      type="text"
      bind:value={$customSchedule[$selectedSchedule].byBlock[block.name]}
    />
    <label>Color</label>
    <div class="input">
      <ColorPicker
        bind:color={$customColors[
          $customSchedule[$selectedSchedule].byBlock[block.name] || block.name
        ]}
      />
    </div>
  {:else}
    <label>Name</label>
    <input
      class="input"
      type="text"
      bind:value={$customSchedule[$selectedSchedule].byDay[block.day][
        block.name
      ]}
    />
    <label>Color</label>
    <div class="input">
      <ColorPicker
        bind:color={$customColors[
          $customSchedule[$selectedSchedule].byDay[block.day][block.name] ||
            block.name
        ]}
      />
    </div>
  {/if}
  <label class="link input" class:active={linkedMode}>
    {(linkedMode && "Linked") || "Individual"} <span>🔗</span><input
      style="display:none"
      type="checkbox"
      bind:checked={linkedMode}
    /></label
  >
</div>

<style>
  label.link span {
    opacity: 0.3;
  }
  label.link.active span {
    opacity: 1;
  }
  .form > * {
    margin-top: var(--pad);
  }
  .form > .input {
    margin-left: var(--normal);
    margin-bottom: var(--normal);
  }
</style>
