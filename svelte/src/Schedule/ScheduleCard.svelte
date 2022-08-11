<script>
  import Card from "../Card.svelte";

  import ScheduleBlockDisplay from "./ScheduleBlockDisplay.svelte";
  import ScheduleChooser from "./ScheduleChooser.svelte";
  let activeOption;
  function setActive(scheduleOption) {
    activeOption = scheduleOption;
  }

  let byDay = {};

  $: {
    if (activeOption?.schedule) {
      byDay = {};
      for (let block of activeOption.schedule) {
        if (!byDay[block.day]) {
          byDay[block.day] = [];
        }
        byDay[block.day].push(block);
      }
    }
  }
  const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
</script>

<Card>
  <div slot="head">
    <h2>Bell Schedule</h2>
    <ScheduleChooser onChange={setActive} />
  </div>
  <div slot="body">
    <div class="schedule">
      {#each [1, 2, 3, 4, 5] as day}
        <div class="day">
          <div class="dayheader">{days[day]}</div>
          {#if byDay && byDay[day]}
            {#each byDay[day] as block}
              <ScheduleBlockDisplay hideDay={true} {block} />
            {/each}
          {/if}
        </div>
      {/each}
    </div>
  </div>
</Card>

<style>
  .schedule {
    display: flex;
    flex-direction: row;
  }
  .day {
    display: flex;
    flex-direction: column;
    justify-content: stretch;
  }
  .dayheader {
    background-color: var(--darkgrey);
    color: white;
    text-align: center;
    padding: var(--pad);
    border-right: 1px solid white;
  }
  .schedule div:last-child .dayheader {
    border-right: 1px solid black;
  }
</style>
