<script lang="ts">
  import { onMount } from "svelte";

  import Card from "../Card.svelte";
  import {
    school,
    prefsSet,
    showPrefs,
    whimsy,
    hideCountdown,
    preferredCountdownName,
  } from "../prefs";
  import Countdown from "../whimsy/Countdown.svelte";

  let showCount = true;
  import { counters } from "./countdowns";
  import UpdateButton from "../util/UpdateButton.svelte";
  import { now } from "../Schedule/now";
  
  let activeCounters = [];
  let theCounter;

  function filterCounters(countdowns) {
    activeCounters = countdowns.filter(
      (c) =>
        $now.getTime() - c.target?.getTime() < 60 * 60 * 4 &&
        $now.getTime() > c.countdownStart?.getTime()
    );
    theCounter =
      activeCounters.find((c) => c.name == $preferredCountdownName) ||
      activeCounters[0];
  }

  $: filterCounters($counters);
  /* When the user changes a counter... */
  function updateCounterPref() {
    $preferredCountdownName = theCounter.name;
  }

  let settingMode = false;
</script>

{#if $whimsy && !$hideCountdown && theCounter}
  <Card bare={true} small={true}>
    <div slot="head" class="top">
      {#if settingMode}
        Countdown to
        {#if activeCounters.length > 1}
          <select bind:value={theCounter} on:change={updateCounterPref}>
            {#each activeCounters as counter}
              <option value={counter}>{counter.name}</option>
            {/each}
          </select>
          <!-- <UpdateButton cds={countdownFetcher} /> -->
        {:else}
          <h2>
            Countdown to {counters[0].name}
          </h2>
        {/if}
        <button
          on:click={() => (settingMode = false)}
          style="margin-left: auto; border-radius: 50%; width: 2em; height: 2em; "
        >
          &times;
        </button>
      {:else}
        <button
          class="close"
          on:click={() => ($hideCountdown = true)}
          style="margin-left: auto; border-radius: 50%; width: 2em; height: 2em; "
        >
          &times;
        </button>
      {/if}
    </div>
    <div slot="body" class="main">
      <Countdown
        target={theCounter.target}
        countdownStart={theCounter.countdownStart}
        name={theCounter.name}
      >
        <button
          class="setting"
          class:active={settingMode}
          on:click={() => (settingMode = !settingMode)}
        >
          ⚙
        </button>
      </Countdown>
    </div>
  </Card>
{/if}

<style>
  .main {
    position: relative;
  }
  .setting {
    opacity: 0;
    transition: opacity 300ms;
  }
  .main:hover .setting {
    opacity: 1;
  }
  .setting {
    position: absolute;
    top: var(--pad);
    left: var(--pad);
    background-color: var(--white);
    color: var(--black);
    width: 2em;
    height: 2em;
    border-radius: 50%;
    display: grid;
    place-content: center;
  }
  .setting.active {
    background-color: var(--black);
    color: var(--white);
  }
  .top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
  .close {
    opacity: 0;
    transition: opacity 300ms;
  }
  .top:hover .close {
    opacity: 1;
  }
  select {
    max-width: 100%;
  }
</style>
