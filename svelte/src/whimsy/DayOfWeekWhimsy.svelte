<script lang="ts">
  import FlowerCanvas from "./FlowerCanvas.svelte";
  import PurpleThursday from "./PurpleThursday.svelte";
  import HalloweenPlus from "./HalloweenPlus.svelte";
  import PiDayTrain from "./PiDayTrain.svelte";
  import HumpDayCanvas from "./HumpDayCanvas.svelte";
  import { now } from "../Schedule/now";

  let dayNum: number;
  let dayOfMonth: number;
  let month: number;
  let year: number;

  let isMothersDay = false;
  let isFathersDay = false;
  let isJune28 = false;
  let isSpringStart = false;
  let isEarthDay = false;

  function getNthSunday(year: number, month: number, n: number) {
    const first = new Date(year, month, 1);
    const firstDay = first.getDay();
    const firstSundayDate = 1 + ((7 - firstDay) % 7);
    return new Date(year, month, firstSundayDate + (n - 1) * 7);
  }

  $: {
    dayNum = $now.getDay();
    dayOfMonth = $now.getDate();
    month = $now.getMonth();
    year = $now.getFullYear();

    const mothersDay = getNthSunday(year, 4, 2); // second Sunday in May
    const fathersDay = getNthSunday(year, 5, 3); // third Sunday in June

    isMothersDay = month === 4 && dayOfMonth === mothersDay.getDate();
    isFathersDay = month === 5 && dayOfMonth === fathersDay.getDate();
    isJune28 = month === 5 && dayOfMonth === 28;
    isSpringStart = month === 2 && dayOfMonth === 20;
    isEarthDay = month === 3 && dayOfMonth === 22;

  }
</script>

{#if isMothersDay || isSpringStart || isEarthDay || isFathersDay || isJune28}
  <FlowerCanvas />
{/if}

{#if dayNum == 4}
  <PurpleThursday />
{/if}
{#if month == 9 && dayOfMonth == 31}
  <HalloweenPlus />
{/if}
{#if month == 2 && dayOfMonth == 14}
  <PiDayTrain />
{/if}

<HumpDayCanvas />

<style>
</style>
