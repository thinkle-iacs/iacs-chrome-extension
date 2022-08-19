<script lang="ts">
  import { onMount } from "svelte";
  import TitleBar from "./TitleBar.svelte";
  import Card from "./Card.svelte";
  import Menu from "./Menu.svelte";
  import StaffMembers from "./Staff/StaffMembers.svelte";
  import TipCard from "./TipCard.svelte";
  import type { Tip } from "./types";
  import { tipDataStore } from "./tips";
  import CalendarCard from "./Calendar/CalendarCard.svelte";
  import RemoteCards from "./CardFetcher/RemoteCards.svelte";
  import ScheduleCard from "./Schedule/ScheduleCard.svelte";
  import CardContainer from "./CardContainer.svelte";
  let tips = tipDataStore.store;
  let dayNum = new Date().getDate();
  let tipIndex = dayNum % $tips.length;
  onMount(() => tipDataStore.update());
</script>

<main>
  <TitleBar />

  <Menu />
  <CardContainer>
    <RemoteCards />
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
    <Card>
      <h2 slot="head">How well do you know our staff?</h2>
      <div slot="body"><StaffMembers /></div>
    </Card>
    <CalendarCard />
    <ScheduleCard />
  </CardContainer>
</main>

<style>
  :global(h1, h2, h3, h4, h5, h6) {
    font-weight: var(--bold);
  }
  :root {
    --darkgrey: #373737;
    --mediumgrey: #4a4a4a;
    --lightgrey: #aaa;
    --blue: #0033a0;
    --red: #c6093b;
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
  }
</style>
