<script lang="ts">
  import TipCard from "./TipCard.svelte";
  import type { Tip } from "./types";
  import { tipDataStore } from "./tips";
  let tips = tipDataStore.store;
  let tip: Tip = {
    title: "",
    content: "",
    link: "",
  };
</script>

<div class="layout">
  <div class="grid">
    <label for="ttitle">Title:</label>
    <input id="ttitle" type="text" bind:value={tip.title} />
    <label for="tcontent">Content:</label>
    <textarea id="tcontent" type="text" bind:value={tip.content} />
    <label for="turl">Link:</label>
    <input id="turl" type="text" bind:value={tip.link} />
  </div>

  <TipCard {tip} temp={true} showNextTip={() => false} />
  <div class="data-stuff">
    <h3>Just this tip</h3>
    <div class="code">
      <pre>{JSON.stringify(tip, null, 2)}</pre>
    </div>
  </div>
  <div>
    <h3>All the tips with this one added:</h3>
    <div class="code">
      <pre>{JSON.stringify([...$tips, tip], null, 2)}</pre>
    </div>
  </div>
</div>

<style>
  pre {
    white-space: pre-wrap;
  }
  .layout {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    display: grid;
    gap: 15px;
  }
  .layout > div {
    grid-column-start: span 2;
  }

  .grid {
    display: grid;
    grid-template-columns: 10em auto;
    grid-template-rows: auto auto auto;
  }
  textarea {
    height: 16em;
  }
</style>
