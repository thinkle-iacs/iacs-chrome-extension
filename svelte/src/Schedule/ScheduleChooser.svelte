<script lang="ts">
  export let onChange;

  import {
    hs_schedule,
    ms_56_ela,
    ms_78_ela,
    ms_56_a,
    ms_78_a,
  } from "./schedule";
  let schedule_options = [
    {
      name: "HS",
      url: "https://docs.google.com/document/d/1E5J9z_fa_PHb-xvwR1W0NvGeV1kGUbgAg-wcvg9bXIQ/edit",
      schedule: hs_schedule,
    },
    {
      name: "5/6 (1)",
      url: "https://docs.google.com/document/d/1suZQXiTsE5QfTgKm1bRyB1fnQDV78WS6DB1c10iSB0c/edit",
      schedule: ms_56_a,
    },
    {
      name: "7/8 (2)",
      url: "https://docs.google.com/document/d/1suZQXiTsE5QfTgKm1bRyB1fnQDV78WS6DB1c10iSB0c/edit",
      schedule: ms_78_a,
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

  let activeOption = schedule_options[0];

  $: schedule = activeOption.schedule;
  $: onChange(activeOption);
</script>

<select bind:value={activeOption}>
  {#each schedule_options as option}
    <option value={option}>{option.name}</option>
  {/each}
</select>

<style>
</style>
