<script lang="ts">
  export let mode: "Staff" | "HS" | "MS" | "Family";
  import type { Menuitem } from "./types";
  import {flip} from "svelte/animate";
  import { derived, writable } from "svelte/store";
  import SubMenu from "./SubMenu.svelte";
  import { CachedDataStore } from "./util/dataFetcher";
  import type { Writable, Readable } from "svelte/store";
  import UpdateButton from "./util/UpdateButton.svelte";
  import { onMount } from "svelte";
  import { defaultMenuItems } from "./menuItems";
  import { collapsedMenus, showPrefs, school } from "./prefs";
  import { GASURL } from "./shimURL";
  import { customMenuStore } from "./CustomMenus/customMenu";
  import CustomMenuEditor from "./CustomMenus/CustomMenuEditor.svelte";
  import { send, receive } from "./menuCrossfade";

  /* let cachedMenuGetter = new CachedDataStore({
    url: `${GASURL}&menu=true`,
    defaultValue: defaultMenuItems,
    expiresAfter: 8 * 60 * 60 * 1000,
    name: "menu",
  }); */

  let menuStore = writable(defaultMenuItems);

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
    if (menuitem.title.search(/\bhs\b/i) != -1) {
      menuitem.school = "HS";
    } else if (menuitem.title.search(/\bms\b/i) != -1) {
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

  let remoteMenuItems: Writable<Menuitem[]> = menuStore; // cachedMenuGetter.store;

  let iacsMenuItems: Writable<Menuitem[]> =
    mode == "Staff" ? writable([]) : cachedIacsMenu.store;

  function assignIds(menus: Menuitem[], parentId = ""): Menuitem[] {
      return menus.map((menu, index) => {
        const id = parentId ? `${parentId}-${index}` : `${index}`; // Unique hierarchical ID
        const newMenu = { ...menu, id }; // Assign the ID

        // Recursively assign IDs to sub-menu items
        if (menu.items && menu.items.length > 0) {
          newMenu.items = assignIds(menu.items, id);
        }

        return newMenu;
      });
  }


  let menuItems: Readable<Menuitem[]> = derived(
    [
      //cachedMenuGetter.store,
      menuStore,
      iacsMenuItems,
      customMenuStore,
    ],
    ([$a, $b, $c]) => assignIds([...$a, ...$b, ...$c])
  );
  $: console.log("Wow, menuitems are:", $menuItems);
  $: console.log('Display items are ', $displayMenuItems);

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

/**
 * Derived store to reorganize and filter menu items.
 */
 const displayMenuItemsOG = derived(
  [menuItems, collapsedMenus, school],
  ([$menuItems, $collapsedMenus, $school]) => {
    const reorganizedMenus = [];
    let priorMenuToCollapse = null;
    let extraId = 0;

    for (const menu of $menuItems) {
      // Filter menus based on school
      if ($school && $school !== "All" && menu.school && menu.school !== $school) {
        continue;
      }
      let thisMenu = {...menu};
      if (priorMenuToCollapse) {
        if (thisMenu.title) {
          // If we were a named column...
          thisMenu = {
            title: '',
            items: [priorMenuToCollapse,thisMenu],
            id: `extra-${extraId++}`,
          };
          extraId++;
        } else {
          // if we were already a column...
          thisMenu.items = [priorMenuToCollapse, ...thisMenu.items]; // add prior menu to top...          
        }
        priorMenuToCollapse = null;
      }

      const isCollapsed = $collapsedMenus[menu.title]; // also if we are a title-less column organizer, check if *all* our children are collapsed
      

      if (isCollapsed) {
        // set priorMenuToCollapse to US
        priorMenuToCollapse = thisMenu;        
      } else {
        reorganizedMenus.push(thisMenu);
      }
    }
    if (priorMenuToCollapse) {
      // if we still have one, just add it to our list...
      reorganizedMenus.push(priorMenuToCollapse);
    }
        
   
    return reorganizedMenus;
  }
);

const displayMenuItems = derived(
  [menuItems, collapsedMenus, school],
  ([$menuItems, $collapsedMenus, $school]) => {
    const reorganizedMenus = [];
    const collapsedMenusContainer = {
      title: 'Hidden',
      items: [],
      id: 'collapsed-container', // Ensure a stable ID for this container
    };

    // Helper function for recursive filtering
    function filterBySchool(menu, school) {
      // Skip menus that don't match the school
      if (school && school !== "All" && menu.school && menu.school !== school) {
        return null;
      }

      // If the menu has nested items, recursively filter them
      if (menu.items && menu.items.length > 0) {
        const filteredItems = menu.items
          .map((item) => filterBySchool(item, school))
          .filter((item) => item !== null); // Remove null entries

        // If all sub-items are removed, also remove this menu
        if (filteredItems.length === 0) {
          return null;
        }

        return { ...menu, items: filteredItems };
      }

      // Otherwise, return the menu as is
      return { ...menu };
    }

    // Helper function to determine if a menu is entirely collapsed
    function isMenuCollapsed(menu) {
      // Check if this menu is explicitly collapsed
      const isDirectlyCollapsed = $collapsedMenus[menu.title];

      // If the menu is a column organizer (no title), check if all children are collapsed
      if (!menu.title && menu.items && menu.items.length > 0) {
        return menu.items.every((child) => isMenuCollapsed(child));
      }

      // Return direct collapse state for regular menus
      return isDirectlyCollapsed;
    }

    // Filter the top-level menus
    const filteredMenus = $menuItems
      .map((menu) => filterBySchool(menu, $school))
      .filter((menu) => menu !== null); // Remove null entries

    for (const menu of filteredMenus) {
      const isCollapsed = isMenuCollapsed(menu);

      if (isCollapsed) {
        // Add to collapsed menus container
        collapsedMenusContainer.items.push({ ...menu });
      } else {
        // Push non-collapsed menu into reorganizedMenus
        reorganizedMenus.push({ ...menu });
      }
    }

    // Add the collapsed menus container if it has items
    if (collapsedMenusContainer.items.length > 0) {
      reorganizedMenus.push(collapsedMenusContainer);
    }

    return reorganizedMenus;
  }
);
  

onMount(() => {
    //cachedMenuGetter.update();
    if (mode !== "Staff") cachedIacsMenu.update();
  });
</script>

<div class="float-wrap">
  <nav class="nav-grid">
    {#each $displayMenuItems as menuitem (menuitem.id)}     
      <nav animate:flip={{duration:400, delay:200}} in:receive={{key:menuitem.id}} out:send={{key:menuitem.id}}><SubMenu {menuitem} /></nav>
    {/each}
    <!-- {#if $menuItems.length % 2}
      <div class="filler">&nbsp;</div>
    {/if} -->
  </nav>
  <div class="float-me">
    {#if mode !== "Family"}
      <button
        class:active={$showPrefs}
        on:click={() => ($showPrefs = !$showPrefs)}
      >
        ⚙
      </button>
      <CustomMenuEditor />
    {/if}
    <!-- <UpdateButton cds={cachedMenuGetter} /> -->
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
  nav.nav-grid {
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

  nav  nav {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: start;
    align-items: start;
  }
</style>
