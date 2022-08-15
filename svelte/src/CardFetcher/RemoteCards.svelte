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
</script>

{#each $cards as card}
  <Card>
    <header slot="head">
      <h2>{card.title}</h2>
      <UpdateButton cds={cardFetcher} />
    </header>
    <div slot="body">
      {@html card.html}
    </div>
    <div slot="footer">
      {#if card.url}
        <a style="margin-left: auto" href={card.url}>See original</a>
      {/if}
    </div>
  </Card>
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
