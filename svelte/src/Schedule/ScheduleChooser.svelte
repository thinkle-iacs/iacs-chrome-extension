<script lang="ts">
  export let showUpdate = false;
  import { onMount } from "svelte";
  import { school, selectedSchedule } from "../prefs";
  import { CachedDataStore } from "../util/dataFetcher";
  import UpdateButton from "../util/UpdateButton.svelte";
  import { GASURL } from "../shimURL";
  export let onChange;
  import { hs_schedule } from "./hs_schedule";

  import {
    ms_56_ela,
    ms_78_ela,
    ms_56_simple,
    ms_78_simple,
    ms_56_trans,
    ms_78_trans,
  } from "./ms_schedule";

  let hardcoded_schedule_options = [
    {
      name: "HS",
      url: "https://docs.google.com/document/d/1E5J9z_fa_PHb-xvwR1W0NvGeV1kGUbgAg-wcvg9bXIQ/edit",
      schedule: hs_schedule,
    },
    {
      name: "5/6 Simple",
      url: "https://docs.google.com/document/d/1suZQXiTsE5QfTgKm1bRyB1fnQDV78WS6DB1c10iSB0c/edit",
      schedule: ms_56_simple,
    },
    {
      name: "7/8 Simple",
      url: "https://docs.google.com/document/d/1suZQXiTsE5QfTgKm1bRyB1fnQDV78WS6DB1c10iSB0c/edit",
      schedule: ms_78_simple,
    },
    {
      name: "5/6 Transitions",
      url: "https://docs.google.com/document/d/1suZQXiTsE5QfTgKm1bRyB1fnQDV78WS6DB1c10iSB0c/edit",
      schedule: ms_56_trans,
    },
    {
      name: "7/8 Transitions",
      url: "https://docs.google.com/document/d/1suZQXiTsE5QfTgKm1bRyB1fnQDV78WS6DB1c10iSB0c/edit",
      schedule: ms_78_trans,
    },
    {
      name: "5/6 (ELA)",
      url: "https://docs.google.com/document/d/1suZQXiTsE5QfTgKm1bRyB1fnQDV78WS6DB1c10iSB0c/edit",
      schedule: ms_56_ela,
    },
    {
      name: "7/8 (ELA)",
      url: "https://docs.google.com/document/d/1suZQXiTsE5QfTgKm1bRyB1fnQDV78WS6DB1c10iSB0c/edit",
      schedule: ms_78_ela,
    },
  ];

  let scheduleLoader = new CachedDataStore({
    expiresAfter: 24 * 60 * 60 * 1000,
    url: `${GASURL}&schedule=true`,
    defaultValue: hardcoded_schedule_options,
    name: "schedules",
  });
  let schedule_options = scheduleLoader.store;
  onMount(() => scheduleLoader.update());

  if (!$selectedSchedule) {
    console.log("Trigger sched update");
    if ($school == "MS") {
      $selectedSchedule = "5/6 Simple";
    } else {
      $selectedSchedule = "HS";
    }
  }

  let scheduleObject;
  $: scheduleObject = $schedule_options.find(
    (o) => o.name == $selectedSchedule
  );
  $: scheduleObject && onChange(scheduleObject);
</script>

{#if $schedule_options.length > 1}
  <select bind:value={$selectedSchedule}>
    {#each $schedule_options as option}
      {#if !option.school || !$school || $school == "All" || $school == option.school}
        <option value={option.name}>{option.name}</option>
      {/if}
    {/each}
  </select>
{/if}
{#if showUpdate}
  <UpdateButton cds={scheduleLoader} />
{/if}

<style>
</style>
