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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      version="1.1"
      id="Capa_1"
      x="0px"
      y="0px"
      width="528.916px"
      height="528.916px"
      viewBox="0 0 528.916 528.916"
      style="enable-background:new 0 0 528.916 528.916;"
      xml:space="preserve"
    >
      <g>
        <g>
          <path
            d="M523.859,232.329h-41.701c-5.07,0-9.715-4.073-10.59-9.067c-19.57-111.442-117-196.409-233.962-196.409    C106.589,26.853,0,133.441,0,264.458c0,131.018,106.589,237.605,237.606,237.605c12.675,0,22.95-10.275,22.95-22.949    s-10.275-22.949-22.95-22.949c-105.708,0-191.706-85.998-191.706-191.707c0-105.707,85.995-191.706,191.703-191.706    c91.583,0,168.325,64.569,187.208,150.564c1.086,4.951-2.359,9.012-7.426,9.012H380.66c-5.07,0-6.578,3.182-3.371,7.108    l69.162,84.621c3.209,3.926,8.408,3.926,11.619,0l69.162-84.621C530.439,235.511,528.928,232.329,523.859,232.329z"
          />
        </g>
      </g>
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
    </svg>
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
  svg {
    height: var(--normal);
    width: var(--normal);
  }
</style>
