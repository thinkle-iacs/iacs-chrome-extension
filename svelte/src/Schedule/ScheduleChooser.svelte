<script lang="ts">
  export let showUpdate = false;
  import { onMount } from "svelte";
  import { school, selectedSchedule } from "../prefs";
  import { CachedDataStore } from "../util/dataFetcher";
  import UpdateButton from "../util/UpdateButton.svelte";
  import { GASURL } from "../shimURL";
  export let onChange;
  import { hs_schedule } from "./hs_schedule";
  import { ms_5th, ms_6th, ms_7th, ms_8th } from "./ms_schedule";
  import { writable } from "svelte/store";

  let hardcoded_schedule_options = [
    {
      name: "HS",
      school: "HS",
      url: "https://docs.google.com/document/d/1eImEt2_wV7mgS5r1gUqDGzvUGyrzDFiTU8V3qLjkkI8/edit?tab=t.0#heading=h.2j7v39y9x97q",
      schedule: hs_schedule,
    },
    {
      name: "5th Grade",
      school: "MS",
      url: "https://docs.google.com/document/d/1suZQXiTsE5QfTgKm1bRyB1fnQDV78WS6DB1c10iSB0c/edit",
      schedule: ms_5th,
    },
    {
      name: "6th Grade",
      school: "MS",
      url: "https://docs.google.com/document/d/1suZQXiTsE5QfTgKm1bRyB1fnQDV78WS6DB1c10iSB0c/edit",
      schedule: ms_6th,
    },
    {
      name: "7th Grade",
      school: "MS",
      url: "https://docs.google.com/document/d/1suZQXiTsE5QfTgKm1bRyB1fnQDV78WS6DB1c10iSB0c/edit",
      schedule: ms_7th,
    },
    {
      name: "8th Grade",
      school: "MS",
      url: "https://docs.google.com/document/d/1suZQXiTsE5QfTgKm1bRyB1fnQDV78WS6DB1c10iSB0c/edit",
      schedule: ms_8th,
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

  // Legacy schedule names from before the 2026-2027 per-grade rename. Map
  // each to a reasonable per-grade replacement so persisted (localStorage)
  // or otherwise stale selections don't silently fail to match any option.
  const legacyScheduleNames: Record<string, string> = {
    "5/6 Simple": "5th Grade",
    "5/6 Transitions": "5th Grade",
    "5/6 (ELA)": "5th Grade",
    "7/8 Simple": "7th Grade",
    "7/8 Transitions": "7th Grade",
    "7/8 (ELA)": "7th Grade",
  };

  if ($selectedSchedule && legacyScheduleNames[$selectedSchedule]) {
    $selectedSchedule = legacyScheduleNames[$selectedSchedule];
  }

  if (!$selectedSchedule) {
    console.log("Trigger sched update");
    if ($school == "MS") {
      $selectedSchedule = "5th Grade";
    } else {
      $selectedSchedule = "HS";
    }
  }
  let activeOptions = [];
  let scheduleObject;
  $: {
    activeOptions = $schedule_options.filter(
      (option) =>
        !option.school ||
        !$school ||
        $school == "All" ||
        $school == option.school
    );
    // Fall back to the first option valid for the current school if the
    // current selection doesn't match anything (e.g. a stale/legacy name
    // that isn't in legacyScheduleNames, or a schedule that isn't offered
    // for the active school).
    if (
      activeOptions.length &&
      !activeOptions.some((o) => o.name == $selectedSchedule)
    ) {
      $selectedSchedule = activeOptions[0].name;
    }
  }
  $: scheduleObject = $schedule_options.find(
    (o) => o.name == $selectedSchedule
  );
  $: scheduleObject && onChange(scheduleObject);
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
