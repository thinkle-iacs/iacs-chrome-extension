<script lang="ts">
  import CalendarEvent from "./CalendarEvent.svelte";

  import Card from "../Card.svelte";
  import { fetchCalendar } from "./calendarFetcher";
  import type { CalendarData } from "./calendarFetcher";
  import { onMount } from "svelte";
  let calData: CalendarData;
  onMount(async () => {
    calData = await fetchCalendar();
  });
</script>

<Card>
  <h1 slot="head">Coming Up...</h1>
  <div slot="body">
    {#if !calData}
      Fetching calendar...
    {:else}
      <h2>Today</h2>
      {#each calData.today as event}
        <CalendarEvent {event} />
      {/each}
      <h2>Tomorrow</h2>
      {#each calData.tomorrow as event}
        <CalendarEvent {event} />
      {/each}
    {/if}
  </div>
</Card>

<style>
  h1,
  h2 {
    margin: 0;
  }
</style>
