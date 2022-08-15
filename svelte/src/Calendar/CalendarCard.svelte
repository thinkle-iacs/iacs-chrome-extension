<script lang="ts">
  import CalendarEvent from "./CalendarEvent.svelte";
  import type { Writable } from "svelte/store";
  import Card from "../Card.svelte";
  import { calendarFetcher } from "./calendarFetcher";
  import type { CalendarData } from "./calendarFetcher";
  import { onMount } from "svelte";
  import UpdateButton from "../util/UpdateButton.svelte";
  let calData: Writable<CalendarData> = calendarFetcher.store;
  onMount(async () => {
    console.log("Update calendar!");
    await calendarFetcher.update();
  });
</script>

<Card>
  <header slot="head">
    <h2>Coming Up...</h2>
    <UpdateButton cds={calendarFetcher} />
  </header>
  <div slot="body">
    {#if !$calData}
      Fetching calendar...
    {:else}
      <table>
        {#if $calData.tomorrow.length}
          <tr>
            <td colspan="3">
              <h2>Today</h2>
            </td>
          </tr>
        {/if}
        {#each $calData.today as event}
          <CalendarEvent {event} />
        {/each}
        {#if $calData.tomorrow.length}
          <tr>
            <td colspan="3">
              <h2>Tomorrow</h2>
            </td>
          </tr>
        {/if}
        {#each $calData.tomorrow as event}
          <CalendarEvent {event} />
        {/each}
      </table>
    {/if}
  </div>
</Card>

<style>
  h1,
  h2 {
    margin: 0;
  }
  header {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
</style>
