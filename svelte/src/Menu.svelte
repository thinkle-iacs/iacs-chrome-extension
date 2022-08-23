<script lang="ts">
  import type { Menuitem } from "./types";
  import SubMenu from "./SubMenu.svelte";
  import { CachedDataStore } from "./util/dataFetcher";
  import type { Writable } from "svelte/store";
  import UpdateButton from "./util/UpdateButton.svelte";
  import { onMount } from "svelte";
  import { defaultMenuItems } from "./menuItems";
  import { showPrefs } from "./prefs";

  let cachedMenuGetter = new CachedDataStore({
    url: "https://script.google.com/macros/s/AKfycbwMbmd-9KnPDPyK3F-ziSLSSulwIpmvD0bja_s7N-trdiqAZLqgpsSocIAPHirLZb67/exec?menu=true",
    defaultValue: defaultMenuItems,
    expiresAfter: 8 * 60 * 60 * 1000,
    name: "menu",
  });
  let menuItems: Writable<Menuitem[]> = cachedMenuGetter.store;
  onMount(() => {
    cachedMenuGetter.update();
  });
</script>

<div class="float-wrap">
  <nav>
    {#each $menuItems as menuitem}
      <SubMenu {menuitem} />
    {/each}
    {#if $menuItems.length % 2}
      <div class="filler">&nbsp;</div>
    {/if}
  </nav>
  <div class="float-me">
    <button
      class:active={$showPrefs}
      on:click={() => ($showPrefs = !$showPrefs)}
    >
      ⚙
    </button>
    <UpdateButton cds={cachedMenuGetter} />
  </div>
</div>

<style>
  .float-wrap {
    position: relative;
  }
  .float-me {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: row;
    gap: var(--pad);
  }
  nav {
    position: relative;
    margin-right: 2em;
    display: grid;
    /* grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); */
    grid-template-columns: repeat(auto-fit, var(--card-width-small));
    justify-content: center;
    width: 100%;
    margin: auto;
    /* flex-direction: row;
    flex-wrap: wrap;
    align-items: start;
    justify-content: start; */
    gap: 10px;
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
    transition: border, background-color, color 300ms;
  }
  button.active {
    background-color: var(--darkgrey);
    color: var(--white);
  }
  button:hover {
    border: 1px solid var(--black, "black");
  }
</style>
