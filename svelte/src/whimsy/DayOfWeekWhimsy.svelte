<script lang="ts">  
  import PurpleThursday from "./PurpleThursday.svelte";
  import { now } from "../Schedule/now";
  let days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ]
  let hide = true;
  let dayNum : number;
  $: dayNum = $now.getDay();
  
</script>

{#if dayNum==4}
<PurpleThursday/>
{/if}

<style>
 
  
</style>
