<script lang="ts">
  export let target = new Date(2023, 5, 20, 12, 25);
  export let countdownStart = new Date(2022, 7, 30, 8, 10);
  export let name = "Summer Vacation";
  import { now } from "../Schedule/now";
  import Hourglass from "./Hourglass.svelte";
  let targetMS = 0;
  let nowMS = 0;
  let remaining = 0;
  $: nowMS = $now.getTime();
  $: targetMS = target.getTime();
  $: remaining = targetMS - nowMS;
  $: updateCountdowns(remaining);
  var daysLeft = 0;
  var hoursLeft = 0;
  var minutesLeft = 0;
  var secondsLeft = 0;
  let totalTime: number;
  $: totalTime = targetMS - countdownStart.getTime();
  //$: console.log('Total time=',totalTime)
  //$: console.log('Remaining = ',remaining,'out of',totalTime,'elapsed=',totalTime-remaining)
  let percentage = 0;

  $: percentage = (totalTime - remaining) / totalTime;

  function makeItNow() {
    target = new Date();
  }

  function zeroPad(num) {
    let s = `${num}`;
    if (s.length == 1) {
      return "0" + s;
    } else {
      return s;
    }
  }

  function updateCountdowns(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    let remainder = ms;
    daysLeft = Math.floor(remainder / day);
    remainder = remainder % day;
    hoursLeft = Math.floor(remainder / hour);
    remainder = remainder % hour;
    minutesLeft = Math.floor(remainder / minute);
    remainder = remainder % minute;
    secondsLeft = Math.floor(remainder / second);
  }
</script>

<div class="countdown">
  <div class="icon">
    {#key target}<Hourglass {percentage} /> {/key}
  </div>
  <div class="words">
    {#if remaining > 0}
      {#if daysLeft}
        <span class="days">
          <span class="digits-3">{daysLeft}</span>
          <span class="unit">days</span>
        </span>
      {/if}
      {#if hoursLeft}
        <span class="hours"
          ><span class="digits-2">{hoursLeft}</span>
          <span class="unit">hours</span></span
        >
      {/if}
      <span class="time digits-4"
        >{zeroPad(minutesLeft)}:{zeroPad(secondsLeft)}</span
      >
      <span class="until"
        >until <b class="target" on:dblclick={makeItNow}>{name}</b></span
      >
    {:else}
      We made it to <b class="target">{name}</b>
    {/if}
    <slot />
  </div>
</div>

<style>
  .until {
    display: block;
  }
  .countdown {
    padding: var(--pad);
    --background-color: var(--blue);
    color: var(--black);
  }
  .countdown {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .icon {
  }
  .words {
    font-size: var(--small);
  }
  .unit {
    font-size: var(--tiny);
  }
  .digits-2 {
    width: 1.3em;
    display: inline-flex;
    justify-content: end;
  }
  .digits-3 {
    width: 1.8em;
    display: inline-flex;
    justify-content: end;
  }
  .digits-4 {
    width: 2.67em;
    display: inline-flex;
    justify-content: end;
  }
</style>
