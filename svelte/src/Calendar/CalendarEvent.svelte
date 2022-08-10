<script lang="ts">
  import type { CalendarEvent } from "./calendarFetcher";
  export let event: CalendarEvent;
  let clickable = false;
  $: clickable = !!event.description;
  let showDesc = false;
  function ft(timestring) {
    return new Date(timestring).toLocaleTimeString();
  }
</script>

<div class="event" class:expanded={showDesc}>
  <div class="row">
    <h3 class:clickable on:click={() => (showDesc = !showDesc)}>
      {event.title}
    </h3>
    <div class="badge">{event.name}</div>
    {#if event.startTime}{ft(event.startTime)}&ndash;{ft(event.endTime)}{/if}
  </div>
  {#if showDesc}
    <div class="desc">{@html event.description}</div>
  {/if}
  {event.id}
</div>

<style>
  .event {
    border: 1px solid transparent;
    border-radius: 5px;
    transition: border-color 300ms;
    padding: var(--pad);
  }
  .expanded {
    border-color: var(--lightgrey);
  }
  .clickable:hover {
    border: 1px solid var(--lightgrey);
    background-color: var(--blue);
    color: white;
  }
  .event {
    margin-bottom: var(--pad);
  }
  h3 {
    margin: 0;
  }
  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: top;
  }
</style>
