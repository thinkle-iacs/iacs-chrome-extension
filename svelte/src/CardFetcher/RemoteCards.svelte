<script lang="ts">
  import type { Writable } from "svelte/store";
  import { onMount } from "svelte";
  import { cardFetcher } from "./cardFetcher";
  import type { RemoteCardData } from "./cardFetcher";
  import Card from "../Card.svelte";
  import UpdateButton from "../util/UpdateButton.svelte";
  let cards: Writable<RemoteCardData[]> = cardFetcher.store;
  onMount(async () => {
    await cardFetcher.update();
  });

  function getDateFromTimestring(timestring, card) {
    let date: Date;
    try {
      return new Date(timestring);
    } catch (err) {
      console.log("Card", card, "had invalid date: ", timestring);
      return;
    }
  }

  function isStarted(timestring, card) {
    let date = getDateFromTimestring(timestring, card);
    let now = new Date().getTime();
    if (now > date.getTime()) {
      return true;
    } else {
      console.log(
        "Not starting for another...",
        (date.getTime() - now) / 1000 / 60 / 60,
        "hours"
      );
      return false;
    }
  }

  function isOver(timestring, card) {
    let date = getDateFromTimestring(timestring, card);
    let now = new Date().getTime();
    if (now > date.getTime()) {
      return true;
    } else {
      console.log(
        "Still showing card for ",
        (date.getTime() - now) / 1000 / 60 / 60,
        "hours"
      );
      return false;
    }
  }
</script>

{#each $cards as card}
  {#if !card.start || isStarted(card.start, card)}
    {#if !card.end || !isOver(card.end, card)}
      <Card
        id={card.title}
        double={card.double}
        small={card.small}
        school={card.school}
      >
        <header slot="head">
          <h2>{card.title}</h2>
          <UpdateButton cds={cardFetcher} />
        </header>
        <div slot="body">
          {@html card.html}
        </div>
        <div slot="footer">
          {#if card.url}
            <a style="color:var(--white);margin-left: auto" href={card.url}
              >Edit original</a
            >
          {/if}
        </div>
      </Card>
    {/if}
  {/if}
{/each}

<style>
  h2 {
    margin: 0;
  }
  header {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
</style>
