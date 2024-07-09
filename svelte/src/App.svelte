<script lang="ts">
  import CountdownCard from "./whimsy/CountdownCard.svelte";

  import TipBuilder from "./TipBuilder.svelte";
  import Snow from "./whimsy/SnowCanvas.svelte";

  import PrefCard from "./PrefCard.svelte";
  import Weather from "./whimsy/Weather.svelte";
  import { onMount } from "svelte";
  import TitleBar from "./TitleBar.svelte";
  import Card from "./Card.svelte";
  import Menu from "./Menu.svelte";
  import StaffMembers from "./Staff/StaffMembers.svelte";
  import TipCard from "./TipCard.svelte";
  import { tipDataStore } from "./tips";
  import CalendarCard from "./Calendar/CalendarCard.svelte";
  import RemoteCards from "./CardFetcher/RemoteCards.svelte";
  import ScheduleCard from "./Schedule/ScheduleCard.svelte";
  import CardContainer from "./CardContainer.svelte";
  import { school, prefsSet, showPrefs, whimsy } from "./prefs";
  import CloseButton from "./CloseButton.svelte";
  import StudentGame from "./StudentGame/StudentGame.svelte";
  import DayOfWeekWhimsy from "./whimsy/DayOfWeekWhimsy.svelte";
  import HalloweenPlus from "./whimsy/HalloweenPlus.svelte";

  let tips = tipDataStore.store;
  let dayNum = new Date().getDate();
  let tipIndex = dayNum % $tips.length;
  onMount(() => tipDataStore.update());

  /* Add secret routing */
  let route;
  let routes = {
    "#tipbuilder": "tipbuilder",
    "#snow": "snow",
    "#halloween": "halloween",
  };
  function checkForSecretHash() {
    let hash = window.location.hash;
    console.log(hash);
    if (routes[hash]) {
      route = routes[hash];
    }
  }
  onhashchange = checkForSecretHash;
  checkForSecretHash();

  const mode: "Staff" | "HS" | "MS" | "Family" = "MODE";
  if (mode == "HS") {
    $school = "HS";
  }
  if (mode == "MS") {
    $school = "MS";
  }
  if (mode == "Family") {
    $whimsy = false;
  }
  let showCount = true;
  let counters = [
    {
      name: "Summer Vacation",
      target: new Date(2023, 5, 20, 12, 25),
      countdownStart: new Date(2022, 7, 30, 8, 10),
    },
    {
      name: "First Day of School",
      countdownStart: new Date(2023, 5, 20, 12, 25),
      target: new Date(2023, 7, 29, 8, 5),
    },
  ];
  let theCounter = counters[0];
</script>

{#if route == "snow"}<Snow />{/if}

<main>
  {#if route == "tipbuilder"}
    <TipBuilder />
  {/if}
  <TitleBar {mode} />

  <Menu {mode} />
  {#if $showPrefs}
    <div class="overlay" on:click={() => ($showPrefs = false)}>
      <PrefCard {mode} />
      <CloseButton on:click={() => ($showPrefs = false)} />
    </div>
  {/if}

  <CardContainer>
    {#if $whimsy && mode !== "Family"}
      <DayOfWeekWhimsy />
    {/if}
    <CountdownCard />
    {#if !$prefsSet && !$showPrefs}
      <PrefCard {mode} />
    {/if}
    <RemoteCards />
    {#if $tips.length && mode !== "Family"}
      {#key tipIndex}
        <TipCard
          tip={$tips[tipIndex]}
          tipStore={tipDataStore}
          showNextTip={() => {
            tipIndex += 1;
            if (tipIndex >= $tips.length) {
              tipIndex = 0;
            }
          }}
        />
      {/key}
    {/if}
    {#if mode == "Staff"}
      <StudentGame />
      <Card id="Staff Guessing Game">
        <h2 slot="head">How well do you know our staff?</h2>
        <div slot="body"><StaffMembers /></div>
      </Card>
    {/if}
    <CalendarCard />
    {#if mode !== "Family"}
      <ScheduleCard />
      <Weather />
    {/if}
  </CardContainer>
  {#if route == "halloween"}<HalloweenPlus />{/if}
  <div class="hidden">
    We are in {mode} mode :-)
  </div>
</main>

<style>
  :global(h1, h2, h3, h4, h5, h6) {
    font-weight: var(--bold);
  }
  :root {
    --white: white;
    --black: black;
    --darkgrey: #373737;
    --mediumgrey: #4a4a4a;
    --lightgrey: #aaa;
    --blue: #0033a0;
    --red: #c6093b;
    --darkshadow: #000000e1;
    --tiny: 10px;
    --small: 12px;
    --normal: 16px;
    --big: 24px;
    --huge: 48px;
    --icon-size: 32px;
    --skinny: 200;
    --bold: 500;
    --spacer: 12px;
    --dark-overlay: #000c;
    --light-text: #efefff;
    --cursive: "Tangerine", cursive;
    --pad: 4px;
    --card-width-small: calc(min(200px, 100vw));
    --card-width: calc(min(404px, 100vw));
    --card-width-double: calc(min(808px, 100vw));
    --bar-height: 48px;
    --medium-big-screen: 1100px;
    --smaller-screen: 800px;
    --off-white: #fffef9;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --off-white: #0d0d11;
      --white: black;
      --black: white;
      --darkgrey: #cfcfcf;
      --lightgrey: #515151;
      --mediumgrey: #afafaf;
      --blue: #a4c1ff;
      --red: #f9b4c7;
      --darkshadow: #ffffffd1;
    }
  }

  .overlay {
    position: fixed;
    opacity: 1;
    background-color: var(--darkshadow);
    display: grid;
    place-content: center;
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    top: 0;
    left: 0;
    z-index: 99;
  }
  .overlay > :global(button) {
    position: absolute;
    right: var(--spacer);
    top: var(--spacer);
    background-color: var(--white);
  }
  .hidden {
    color: transparent;
  }
</style>
