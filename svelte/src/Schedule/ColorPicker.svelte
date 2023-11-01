<script lang="ts">
  import Palette from "./Palette.svelte";

  import { createEventDispatcher } from "svelte";
  import CloseButton from "../CloseButton.svelte";

  const dispatch = createEventDispatcher();

  export let color = "#000000";

  function handleChange(event) {
    dispatch("change", event.target.value);
  }
  function setColor(c) {
    color = c;
    dispatch("change", c);
  }

  let expanded = false;
  let mode: "recommended" | "custom" = "recommended";
  let materialColorNames = [
    "red",
    "pink",
    "purple",
    "deep-purple",
    "indigo",
    "blue",
    "light-blue",
    "cyan",
    "teal",
    "green",
    "light-green",
    "lime",
    "yellow",
    "amber",
    "orange",
    "deep-orange",
    "brown",
    "grey",
    "blue-grey",
  ];
  let variants = [
    "50",
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
    "a100",
    "a200",
    "a400",
    "a700",
  ];
  let colorInput: HTMLInputElement;

  $: {
    if (mode == "custom" && colorInput) {
      colorInput.focus();
      colorInput.click();
    }
  }
  let popup: HTMLDivElement;

  function handleClickOutsidePopup(event) {
    if (expanded && !popup.contains(event.target)) {
      expanded = false;
    }
  }
</script>

<svelte:window on:click={handleClickOutsidePopup} />

<button
  style:background-color={color}
  class="color-picker"
  aria-valuetext="Color Picker"
  on:click|stopPropagation={() => (expanded = !expanded)}
  ><Palette />
</button>
{#if expanded}
  <div class="pop-up" bind:this={popup}>
    <div style="position:absolute;right:8px;top:8px;">
      <CloseButton on:click={() => (expanded = false)} />
    </div>
    <div class="tabs">
      <button
        on:click={() => (mode = "recommended")}
        class="tab"
        class:active={mode == "recommended"}>Palette</button
      >
      <button
        class="tab"
        on:click={() => (mode = "custom")}
        class:active={mode == "custom"}>All</button
      >
    </div>
    {#if mode == "recommended"}
      <div class="material">
        <div class="grid">
          {#each materialColorNames as colorBase}
            <div class="col">
              {#each variants as variant}
                <button
                  class="color"
                  style="background-color: var(--material-color-{colorBase}-{variant})"
                  on:click={() =>
                    setColor(`var(--material-color-${colorBase}-${variant})`)}
                />
              {/each}
            </div>
          {/each}
        </div>
      </div>
    {:else}
      <div class="custom">
        <div>
          Custom: <input
            bind:this={colorInput}
            type="color"
            bind:value={color}
            on:change={handleChange}
          />
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  .grid {
    display: flex;
    gap: 4px;
  }
  .col {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .col button {
    width: 16px;
    height: 16px;
  }
  .pop-up {
    position: fixed;
    width: 400px;
    height: 500px;
    top: 50%;
    left: 50%;
    z-index: 999999;
    background-color: var(--white);
    transform: translate(-50%, -50%);
    padding: var(--pad);
  }
  .color-picker {
    display: grid;
    place-content: center;
    border-radius: 50%;
  }
  button.tab {
    border-bottom: none;
  }
  button.tab.active {
    font-weight: bold;
  }
</style>
