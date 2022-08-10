<script lang="ts">
  import { onMount } from "svelte";
  import { fetchCards } from "./cardFetcher";
  import type { RemoteCardData } from "./cardFetcher";
  import Card from "../Card.svelte";
  let cards: RemoteCardData[] = [];
  onMount(async () => {
    cards = await fetchCards();
  });
</script>

{#each cards as card}
  <Card>
    <h2 slot="head">{card.title}</h2>
    <div slot="body">
      {@html card.html}
      {#if card.url}
        <a href={card.url}>Original</a>
      {/if}
    </div>
  </Card>
{/each}
