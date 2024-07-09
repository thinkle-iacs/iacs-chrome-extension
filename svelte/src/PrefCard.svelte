<script lang="ts">
  export let mode: "HS" | "MS" | "Staff" | "Family";
  import Card from "./Card.svelte";
  import {
    activeCardIDs,
    hiddenCards,
    whimsy,
    school,
    hideCountdown,
  } from "./prefs";

  $: console.log("Got new whimsy val? ", $whimsy);
  function dontBubble(e: MouseEvent) {
    e.stopPropagation();
  }
</script>

{#if mode !== "Family"}
  <Card on:click={dontBubble}>
    <h2 slot="head">⚙ Settings</h2>
    <div slot="body">
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
      <input type="checkbox" bind:checked={$whimsy} /> Allow occasional whimsy
      {#if $whimsy}
        <br /><input type="checkbox" bind:checked={$hideCountdown} /> Hide countdown
      {/if}
      <h2>Hidden Cards</h2>
      {#each $activeCardIDs as cardId}
        <input bind:checked={$hiddenCards[cardId]} type="checkbox" />
        {cardId}<br />
      {/each}
    </div>
  </Card>
{/if}

<style>
</style>
