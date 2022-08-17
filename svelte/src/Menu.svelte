<script lang="ts">
  import type { Menuitem } from "./types";
  import SubMenu from "./SubMenu.svelte";
  import { CachedDataStore } from "./util/dataFetcher";
  import type { Writable } from "svelte/store";
  import UpdateButton from "./util/UpdateButton.svelte";
  import { onMount } from "svelte";
  import { defaultMenuItems } from "./menuItems";

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
  </nav>
  <div class="float-me"><UpdateButton cds={cachedMenuGetter} /></div>
</div>

<style>
  .float-wrap {
    position: relative;
  }
  .float-me {
    position: absolute;
    top: 0;
    right: 0;
  }
  nav {
    position: relative;
    margin-right: 2em;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    width: 100%;
    margin: auto;
    /* flex-direction: row;
    flex-wrap: wrap;
    align-items: start;
    justify-content: start; */
    gap: 10px;
  }
</style>
