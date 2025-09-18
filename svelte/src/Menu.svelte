<script lang="ts">
  export let mode: "Staff" | "HS" | "MS" | "Family";
  import type { Menuitem } from "./types";
  import { flip } from "svelte/animate";
  import { derived, writable } from "svelte/store";
  import SubMenu from "./SubMenu.svelte";
  import type { Writable, Readable } from "svelte/store";
  import { onMount } from "svelte";
  import { collapsedMenus, showPrefs, school, hiddenMenuItems } from "./prefs";
  import CustomMenuEditor from "./CustomMenus/CustomMenuEditor.svelte";
  import { send, receive } from "./menuCrossfade";
  import { createComposedMenuItems } from "./util/menuComposer";

  // Use the shared menu composition utility
  const menuComposer = createComposedMenuItems(mode);
  let menuItems: Readable<Menuitem[]> = menuComposer.store;

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
        if (
          $school &&
          $school !== "All" &&
          menu.school &&
          menu.school !== $school
        ) {
          continue;
        }
        let thisMenu = { ...menu };
        if (priorMenuToCollapse) {
          if (thisMenu.title) {
            // If we were a named column...
            thisMenu = {
              title: "",
              items: [priorMenuToCollapse, thisMenu],
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
    [menuItems, collapsedMenus, school, hiddenMenuItems],
    ([$menuItems, $collapsedMenus, $school, $hiddenMenuItems]) => {
      const reorganizedMenus = [];
      const collapsedMenusContainer = {
        title: "Hidden",
        items: [],
        id: "collapsed-container", // Ensure a stable ID for this container
      };

      // Helper function for recursive filtering
      function filterBySchool(menu, school) {
        // Skip menus that don't match the school
        if (
          school &&
          school !== "All" &&
          menu.school &&
          menu.school !== school
        ) {
          return null;
        }

        // If the menu has nested items, recursively filter them
        if (menu.items && menu.items.length > 0) {
          const filteredItems = menu.items
            .map((item) => filterBySchool(item, school))
            .filter((item) => item !== null) // Remove null entries
            .filter((item) => !item.title || !$hiddenMenuItems[item.title]); // Remove hidden items

          // If all sub-items are removed, also remove this menu
          if (filteredItems.length === 0) {
            return null;
          }

          return { ...menu, items: filteredItems };
        }

        // Otherwise, return the menu as is
        return { ...menu };
      }

      // Helper function to check if a menu should be hidden
      function isMenuHidden(menu) {
        // Check if this top-level menu is explicitly hidden
        return $hiddenMenuItems[menu.title];
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
        .filter((menu) => menu !== null) // Remove null entries
        .filter((menu) => !isMenuHidden(menu)); // Remove hidden menus

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
    menuComposer.updateIacsMenu();
  });
</script>

<div class="float-wrap">
  <nav class="nav-grid">
    {#each $displayMenuItems as menuitem (menuitem.id)}
      <nav
        animate:flip={{ duration: 400, delay: 200 }}
        in:receive={{ key: menuitem.id }}
        out:send={{ key: menuitem.id }}
      >
        <SubMenu {menuitem} {mode} />
      </nav>
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

  nav nav {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: start;
    align-items: start;
  }
</style>
