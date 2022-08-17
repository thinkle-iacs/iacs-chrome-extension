<script lang="ts">
  import type { Tip } from "./types";
  import Card from "./Card.svelte";
  import UpdateButton from "./util/UpdateButton.svelte";
  export let showNextTip: function;
  export let tip: Tip;
  export let tipStore;
  let mac;
  let platform =
    window.navigator?.userAgentData?.platform || window.navigator.platform;
  if (platform.indexOf("Mac")) {
    mac = true;
  } else {
    mac = false;
  }
</script>

<Card>
  <div class="slot" slot="head">
    <div class="fancy">Tip of the Day</div>
    <div class="title">
      {tip.title}
    </div>
    {#if tipStore}<UpdateButton cds={tipStore} />{/if}
  </div>
  <div class="slot" slot="body">
    <div class="center" class:mac>
      {#if tip.image}
        <img src={tip.image} />
      {/if}
      <div class="content">
        {@html tip.content}
      </div>
    </div>
  </div>
  <div class="slot" slot="footer">
    {#if tip.link}
      <a href={tip.link}>More about this</a>
    {:else}
      <div />
    {/if}
    <a on:click={showNextTip}>Next Tip</a>
  </div>
</Card>

<style>
  div {
    max-width: 500px;
  }
  div.slot {
    display: contents;
  }
  .content {
    text-align: left;
  }

  :global(.ctrl)::before {
    content: "Ctrl";
  }

  :global(.key),
  :global(.ctrl)::before {
    padding: var(--pad);
    display: inline-block;
    border: 1px solid var(--lightgrey);
    margin-left: var(--pad);
    margin-right: calc(var(--pad) / 2);
  }

  .mac :global(.ctrl)::before {
    content: "⌘";
    padding: var(--pad);
    display: inline-block;
    border: 1px solid var(--lightgrey);
  }
  .title {
    font-weight: bold;
    font-size: 120%;
  }
  .fancy {
    font-family: cursive;
  }
</style>
