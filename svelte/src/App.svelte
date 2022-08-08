<script lang="typescript">
  import TitleBar from "./TitleBar.svelte";
  import Card from "./Card.svelte";
  import Menu from "./Menu.svelte";
  import StaffMembers from "./Staff/StaffMembers.svelte";
  import TipCard from "./TipCard.svelte";
  import type { Tip } from "./types";
  import { tips } from "./tips";
  /* import CalendarCard from "./Calendar/CalendarCard.svelte"; */
  let tipIndex = 0;
</script>

<main>
  <TitleBar />
  <Menu />
  <div class="card-container">
    {#key tipIndex}
      <TipCard
        tip={tips[tipIndex]}
        showNextTip={() => {
          tipIndex += 1;
          if (tipIndex >= tips.length) {
            tipIndex = 0;
          }
        }}
      />
    {/key}
    <Card>
      <h2 slot="head">How well do you know our staff?</h2>
      <div slot="body"><StaffMembers /></div>
    </Card>
  </div>
</main>

<style>
  .card-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 4px;
    align-items: start;
  }
  :root {
    --darkgrey: #373737;
    --lightgrey: #aaa;
    --blue: #0033a0;
    --red: #c6093b;
    --small: 11px;
    --normal: 16px;
    --large: 24px;
    --skinny: 300;
    --normal: 400;
    --bold: 900;
    --space: 8px;
    --pad: 4px;
  }
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
