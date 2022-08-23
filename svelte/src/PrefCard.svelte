<script lang="ts">
  import Card from "./Card.svelte";
  import { activeCardIDs, hiddenCards, school } from "./prefs";
</script>

<Card>
  <h2 slot="head">⚙ Settings</h2>
  <div slot="body">
    <label
      >School
      <select bind:value={$school}>
        <option value={"HS"}>High School</option>
        <option value={"MS"}>Middle School</option>
        <option value={"All"}>Whole School</option>
        <option value={null}>-</option>
      </select>
    </label>
    <h2>Hidden Cards</h2>
    {#each $activeCardIDs as cardId}
      <input bind:checked={$hiddenCards[cardId]} type="checkbox" />
      {cardId}<br />
    {/each}
  </div>
</Card>

<style>
</style>
