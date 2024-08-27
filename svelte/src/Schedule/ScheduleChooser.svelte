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
  import { writable } from "svelte/store";

  let hardcoded_schedule_options = [
    {
      name: "HS",
      school: "HS",
      url: "https://docs.google.com/document/d/1eImEt2_wV7mgS5r1gUqDGzvUGyrzDFiTU8V3qLjkkI8/edit?tab=t.0#heading=h.2j7v39y9x97q",
      schedule: hs_schedule,
    },
    {
      name: "5/6 Simple",
      school: "MS",
      url: "https://docs.google.com/document/d/1suZQXiTsE5QfTgKm1bRyB1fnQDV78WS6DB1c10iSB0c/edit",
      schedule: ms_56_simple,
    },
    {
      name: "7/8 Simple",
      school: "MS",
      url: "https://docs.google.com/document/d/1suZQXiTsE5QfTgKm1bRyB1fnQDV78WS6DB1c10iSB0c/edit",
      schedule: ms_78_simple,
    },
    {
      name: "5/6 Transitions",
      school: "MS",
      url: "https://docs.google.com/document/d/1suZQXiTsE5QfTgKm1bRyB1fnQDV78WS6DB1c10iSB0c/edit",
      schedule: ms_56_trans,
    },
    {
      name: "7/8 Transitions",
      school: "MS",
      url: "https://docs.google.com/document/d/1suZQXiTsE5QfTgKm1bRyB1fnQDV78WS6DB1c10iSB0c/edit",
      schedule: ms_78_trans,
    },
    {
      name: "5/6 (ELA)",
      school: "MS",
      url: "https://docs.google.com/document/d/1suZQXiTsE5QfTgKm1bRyB1fnQDV78WS6DB1c10iSB0c/edit",
      schedule: ms_56_ela,
    },
    {
      name: "7/8 (ELA)",
      school: "MS",
      url: "https://docs.google.com/document/d/1suZQXiTsE5QfTgKm1bRyB1fnQDV78WS6DB1c10iSB0c/edit",
      schedule: ms_78_ela,
    },
  ];

  /* let scheduleLoader = new CachedDataStore({
    expiresAfter: 24 * 60 * 60 * 1000,
    url: `${GASURL}&schedule=true`,
    defaultValue: hardcoded_schedule_options,
    name: "schedules",
  }); */
  let schedule_options = writable(hardcoded_schedule_options); // scheduleLoader.store;
  // onMount(() => scheduleLoader.update());

  if (!$selectedSchedule) {
    console.log("Trigger sched update");
    if ($school == "MS") {
      $selectedSchedule = "5/6 Simple";
    } else {
      $selectedSchedule = "HS";
    }
  }
  let activeOptions = [];
  let scheduleObject;
  $: scheduleObject = $schedule_options.find(
    (o) => o.name == $selectedSchedule
  );
  $: scheduleObject && onChange(scheduleObject);
  $: {
    activeOptions = $schedule_options.filter(
      (option) =>
        !option.school ||
        !$school ||
        $school == "All" ||
        $school == option.school
    );
  }
</script>

{#if activeOptions.length > 1}
  <select bind:value={$selectedSchedule}>
    {#each activeOptions as option}
      <!-- {#if !option.school || !$school || $school == "All" || $school == option.school} -->
      <option value={option.name}>{option.name}</option>
      <!-- {/if} -->
    {/each}
  </select>
{/if}

<!-- {#if showUpdate}
  <UpdateButton cds={scheduleLoader} />
{/if} -->

<style>
</style>
