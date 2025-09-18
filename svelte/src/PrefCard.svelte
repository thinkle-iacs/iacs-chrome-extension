<script lang="ts">
  export let mode: "HS" | "MS" | "Staff" | "Family";
  import Card from "./Card.svelte";
  import MenuPreferences from "./MenuPreferences.svelte";
  import {
    activeCardIDs,
    hiddenCards,
    whimsy,
    school,
    hideCountdown,
  } from "./prefs";
  import { createComposedMenuItems } from "./util/menuComposer";

  // Use the shared menu composition utility
  const menuComposer = createComposedMenuItems(mode);
  $: modeMenuItems = menuComposer.store;

  $: console.log("Got new whimsy val? ", $whimsy);
  function dontBubble(e: MouseEvent) {
    e.stopPropagation();
  }

  let activeTab = "General";
  $: console.log("Active tab is now ", activeTab);

  function toggleCardVisibility(cardId: string) {
    $hiddenCards[cardId] = !$hiddenCards[cardId];
  }

  function toggleCountdownVisibility() {
    $hideCountdown = !$hideCountdown;
  }
</script>

{#if mode !== "Family"}
  <Card on:click={dontBubble}>
    <h2 slot="head">⚙ Settings</h2>
    <div slot="body" class="big">
      <div class="tab-bar">
        <div
          class="tab"
          class:active={activeTab === "General"}
          on:click={() => (activeTab = "General")}
        >
          General
        </div>
        {#if $activeCardIDs.length > 0}
          <div
            class="tab"
            class:active={activeTab === "Cards"}
            on:click={() => (activeTab = "Cards")}
          >
            Cards
          </div>
        {/if}
        <div
          class="tab"
          class:active={activeTab === "Menus"}
          on:click={() => (activeTab = "Menus")}
        >
          Menus
        </div>
      </div>
      <div class="tab-content">
        {#if activeTab === "General"}
          {#if mode == "Staff"}
            <label
              >School
              <select bind:value={$school}>
                <option value={"HS"}>High School</option>
                <option value={"MS"}>Middle School</option>
                <option value={"All"}>Whole School</option>
                <option value={null}>-</option>
              </select>
            </label>
          {/if}
          <input type="checkbox" bind:checked={$whimsy} /> Allow occasional
          whimsy
          {#if $whimsy}
            <br /><input
              type="checkbox"
              checked={!$hideCountdown}
              on:change={toggleCountdownVisibility}
            /> Show countdown
          {/if}
        {:else if activeTab === "Cards"}
          <h2>Visible Cards</h2>
          {#each $activeCardIDs as cardId}
            <input
              checked={!$hiddenCards[cardId]}
              type="checkbox"
              on:change={() => toggleCardVisibility(cardId)}
            />
            {cardId}<br />
          {/each}
        {:else if activeTab === "Menus"}
          <MenuPreferences allMenuItems={$modeMenuItems} {mode} />
        {/if}
      </div>
    </div>
  </Card>
{/if}

<style>
  .tab-bar {
    display: flex;
    justify-content: start;
    gap: 4px;
    margin-bottom: 1em;
  }
  .tab {
    padding: 0.2em 0.5em;
    border: 1px solid #8888;
    border-bottom: none;
    border-radius: 0.5em 0.5em 0 0;
    color: var(--mediumgrey);
  }
  .big {
    min-width: var(--card-width-double);
    min-height: 60dvh;
    max-height: 80vh;
    overflow-y: auto;
  }
  .tab.active {
    background: var(--blue);
    color: white;
    border-color: var(--black);
  }
</style>
