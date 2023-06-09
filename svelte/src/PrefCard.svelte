<script lang="ts">
  export let mode: "HS" | "MS" | "Staff";
  import Card from "./Card.svelte";
  import { activeCardIDs, hiddenCards, whimsy, school } from "./prefs";

  $: console.log("Got new whimsy val? ", $whimsy);
  function dontBubble (e : MouseEvent) {
    e.stopPropagation()
  }
</script>

<Card on:click={dontBubble}>
  <h2 slot="head">⚙ Settings</h2>
  <div slot="body">
    MODE: {mode}
    <input type="checkbox" bind:checked={$whimsy} /> Allow occasional whimsy
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
    <h2>Hidden Cards</h2>
    {#each $activeCardIDs as cardId}
      <input bind:checked={$hiddenCards[cardId]} type="checkbox" />
      {cardId}<br />
    {/each}
  </div>
</Card>

<style>
</style>
