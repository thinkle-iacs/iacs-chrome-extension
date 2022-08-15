<script lang="ts">
  import type { CachedDataStore } from "./dataFetcher";
  import type { Writable } from "svelte/store";
  export let cds: CachedDataStore;
  const RIGHT = 1;
  const LEFT = 2;
  const CENTER = 3;
  export let position = RIGHT;
  let updating: Writable<boolean> = cds.updatingStore;
  let expiration: Writable<number> = cds.expirationStore;
  let lastUpdateDate;
  $: lastUpdateDate = $expiration && new Date($expiration - cds.expiresAfter);
  let tipHidden = true;
  function showTooltip() {
    tipHidden = false;
  }
  function hideTooltip() {
    tipHidden = true;
  }
</script>

<div
  class="container"
  class:right={position == RIGHT}
  class:left={position == LEFT}
  class:center={position == CENTER}
>
  <button
    on:mouseenter={showTooltip}
    on:mouseleave={hideTooltip}
    class:updating={$updating}
    disabled={$updating}
    on:click={() => cds.updateFromRemote()}
  >
    ⟳
  </button>
  {#if lastUpdateDate}
    <div
      class="tooltip"
      class:hide={tipHidden}
      on:mouseenter={showTooltip}
      on:mouseleave={hideTooltip}
    >
      {#if $updating}
        Fetching new data...
      {:else}
        Click to fetch new {cds.name} data
      {/if}
      <br />Last updated on
      {lastUpdateDate.toLocaleTimeString([], {
        month: "numeric",
        day: "numeric",
        hours: "numeric",
        minutes: "2-digit",
      })}
    </div>
  {/if}
</div>

<style>
  button.updating {
    animation: spin 1000ms infinite;
  }
  @keyframes spin {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .container {
    position: relative;
  }
  .tooltip {
    display: grid;
    place-content: center;
    text-align: center;
    height: 3em;
    width: 20em;
    position: absolute;
    top: 2em;
    background-color: #23232388;
    color: white;
  }
  .right .tooltip {
    right: 0;
  }
  .left .tooltip {
    left: 0;
  }
  .center .tooltip {
    left: 10em;
  }
  .tooltip {
    opacity: 1;
    transition: opacity 300ms;
  }
  .tooltip.hide {
    pointer-events: none;
    opacity: 0;
  }
  button {
    border: none;
    background-color: unset;
    display: grid;
    place-content: center;
    width: 2em;
    height: 2em;
    border-radius: 50%;
    border: 1px solid var(--lightgrey);
  }
  button:hover {
    border: 1px solid black;
    transition: border 300ms;
  }
</style>
