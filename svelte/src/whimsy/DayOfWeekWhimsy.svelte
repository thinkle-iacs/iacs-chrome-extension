<script lang="ts">
  import PurpleThursday from "./PurpleThursday.svelte";
  import HalloweenPlus from "./HalloweenPlus.svelte";
  import { now } from "../Schedule/now";
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let hide = true;
  let dayNum: number;
  let dayOfMonth: number;
  let month: number;
  let year: number;
  $: {
    dayNum = $now.getDay();
    dayOfMonth = $now.getDate();
    month = $now.getMonth();
    year = $now.getFullYear();
  }
  console.log("dayOfMonth", dayOfMonth, "month", month);
</script>

<!-- {#if dayNum == 4}
  <PurpleThursday />
{/if} -->
{#if month == 9 && dayOfMonth == 31}
  <HalloweenPlus />
{/if}

<style>
</style>
