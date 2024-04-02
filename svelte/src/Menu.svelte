<script lang="ts">
  export let mode: "Staff" | "HS" | "MS" | "Family";
  import type { Menuitem } from "./types";
  import { derived } from "svelte/store";
  import SubMenu from "./SubMenu.svelte";
  import { CachedDataStore } from "./util/dataFetcher";
  import type { Writable, Readable } from "svelte/store";
  import UpdateButton from "./util/UpdateButton.svelte";
  import { onMount } from "svelte";
  import { defaultMenuItems } from "./menuItems";
  import { collapsedMenus, showPrefs } from "./prefs";
  import { GASURL } from "./shimURL";
  import { customMenuStore } from "./CustomMenus/customMenu";
  import CustomMenuEditor from "./CustomMenus/CustomMenuEditor.svelte";

  let cachedMenuGetter = new CachedDataStore({
    url: `${GASURL}&menu=true`,
    defaultValue: defaultMenuItems,
    expiresAfter: 8 * 60 * 60 * 1000,
    name: "menu",
  });

  type IACSMenuItem = {
    ID: number;
    title: string;
    url: string;
    parent: string;
  };

  type IACSMenuJson = {
    status: "OK";
    code: number;
    data: {
      menu_id: number;
      menu_name: string;
      menu_items: IACSMenuItem[];
    }[];
  };

  const iacsMenuToMenu = (
    item: IACSMenuItem,
    menu: IACSMenuItem[],
    level: number = 0
  ): Menuitem => {
    let items = menu
      .filter((i) => parseInt(i.parent) == item.ID)
      .map((i) => iacsMenuToMenu(i, menu, level + 1));
    let menuitem: Menuitem = {
      title: item.title,
    };
    if (item.url && item.url != "#") {
      menuitem.link = item.url;
    }
    if (items.length) {
      menuitem.items = items;
    }
    if (level >= 1 && items.length) {
      $collapsedMenus[item.title] = true;
    }
    if (menuitem.title.search(/\bhs\b/i)) {
      menuitem.school = "HS";
    } else if (menuitem.title.search(/\bms\b/i)) {
      menuitem.school = "MS";
    }
    return menuitem;
  };

  let cachedIacsMenu = new CachedDataStore({
    url: `https://www.innovationcharter.org/wp-json/wcra/v1/getmenu/?secret_key=xvUGieok96ky4rDPgsSCf5B8HRsiejzo`,
    defaultValue: [],
    expiresAfter: 8 * 60 * 60 * 1000,
    name: "iacsMenu",
    transformer: (jsonResponse: IACSMenuJson) => {
      if (jsonResponse.code != 200) {
        console.error(
          "Invalid response from IACS menu: ",
          jsonResponse.code,
          jsonResponse
        );
        return [];
      }
      let menu = jsonResponse.data.find((m) => m.menu_name == "Main Menu");
      if (!menu) {
        console.error(
          "No main menu found in IACS menu response: ",
          jsonResponse
        );
        return [];
      }
      const parents = ["MS Athletics", "HS Athletics"];
      let parentsItems = menu.menu_items.filter((item) =>
        parents.includes(item.title)
      );
      return [
        {
          items: parentsItems.map((i) => iacsMenuToMenu(i, menu.menu_items, 1)),
        },
      ];
    },
  });

  let remoteMenuItems: Writable<Menuitem[]> = cachedMenuGetter.store;
  let iacsMenuItems: Writable<Menuitem[]> = cachedIacsMenu.store;
  let menuItems: Readable<Menuitem[]> = derived(
    [cachedMenuGetter.store, iacsMenuItems, customMenuStore],
    ([$a, $b, $c]) => [...$a, ...$b, ...$c]
  );
  $: console.log("Wow, menuitems are:", $menuItems);

  const crawlForAutoCollapsingMenus = (menuItem: Menuitem) => {
    if (menuItem.items) {
      for (let item of menuItem.items) {
        crawlForAutoCollapsingMenus(item);
      }
      if (menuItem.collapse) {
        $collapsedMenus[menuItem.title] = true;
      }
    }
  };

  $: $menuItems.map(crawlForAutoCollapsingMenus);

  onMount(() => {
    cachedMenuGetter.update();
    if (mode == "Family") {
      cachedIacsMenu.update();
    }
  });
</script>

<div class="float-wrap">
  <nav>
    {#each $menuItems as menuitem}
      <SubMenu {menuitem} />
    {/each}
    <!-- {#if $menuItems.length % 2}
      <div class="filler">&nbsp;</div>
    {/if} -->
  </nav>
  <div class="float-me">
    <button
      class:active={$showPrefs}
      on:click={() => ($showPrefs = !$showPrefs)}
    >
      ⚙
    </button>
    <CustomMenuEditor />
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
    transition:
      border,
      background-color,
      color 300ms;
  }
  button.active {
    background-color: var(--darkgrey);
    color: var(--white);
  }
  button:hover {
    border: 1px solid var(--black, "black");
  }
</style>
