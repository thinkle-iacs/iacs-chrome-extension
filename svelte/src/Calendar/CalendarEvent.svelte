<script lang="ts">
  import type { CalendarEvent } from "./calendarFetcher";
  export let event: CalendarEvent;
  let clickable = false;
  $: clickable = !!event.description;
  let showDesc = false;
  function ft(timestring) {
    let s = new Date(timestring).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
    return s.replace(":00", "");
  }
</script>

<tbody class="event" class:expanded={showDesc}>
  <tr>
    <td>
      <h3 class:clickable on:click={() => (showDesc = !showDesc)}>
        {event.title}
      </h3>
    </td>
    <td><div class="badge">{event.name}</div></td>
    <td class="time"
      >{#if event.startTime}{ft(event.startTime)}&ndash;{ft(
          event.endTime
        )}{/if}</td
    >
  </tr>
  {#if showDesc}
    <tr class="desc">
      <td colspan="3">{@html event.description}</td>
    </tr>
  {/if}
</tbody>

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
    font-size: var(--normal);
  }

  .time {
    whitespace: no-wrap;
  }
</style>
