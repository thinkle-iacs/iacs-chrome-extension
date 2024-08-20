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
    <label class="name-label">Name</label>
    <input
      class="input"
      type="text"
      bind:value={$customSchedule[$selectedSchedule].byBlock[block.name]}
    />

    <div class="input color">
      <ColorPicker
        bind:color={$customColors[
          $customSchedule[$selectedSchedule].byBlock[block.name] || block.name
        ]}
      />
    </div>
  {:else}
    <label class="name-label">Name</label>
    <input
      class="input"
      type="text"
      bind:value={$customSchedule[$selectedSchedule].byDay[block.day][
        block.name
      ]}
    />

    <div class="color input">
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

  .form {
    display: grid;
    grid-template-areas:
      "label label"
      "name name"
      "color link";
  }

  .form > * {
    margin-top: var(--pad);
  }
  .form > .input {
    margin-bottom: var(--normal);
  }
  input {
    width: 100%;
  }
  .name-label {
    grid-area: label;
  }
  .input {
    grid-area: name;
  }
  .color {
    grid-area: color;
  }
  .link {
    grid-area: link;
  }
</style>
