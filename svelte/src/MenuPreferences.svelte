<script lang="ts">
  import { hiddenMenuItems, collapsedMenus, school } from "./prefs";
  import type { Menuitem } from "./types";
  import type { SchoolType } from "./prefs";

  export let allMenuItems: Menuitem[] = [];
  export let mode: "HS" | "MS" | "Staff" | "Family";

  // Filter menu items by school (same logic as Menu.svelte)
  function filterBySchool(
    menu: Menuitem,
    schoolFilter: SchoolType
  ): Menuitem | null {
    // Skip menus that don't match the school
    if (
      schoolFilter &&
      schoolFilter !== "All" &&
      menu.school &&
      menu.school !== schoolFilter
    ) {
      return null;
    }

    // If the menu has nested items, recursively filter them
    if (menu.items && menu.items.length > 0) {
      const filteredItems = menu.items
        .map((item) => filterBySchool(item, schoolFilter))
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

  // Get school filter value based on mode
  $: schoolFilter = mode === "Staff" ? $school : (mode as SchoolType);

  // Filter menu items based on school
  $: filteredMenuItems = allMenuItems
    .map((menu) => filterBySchool(menu, schoolFilter))
    .filter((menu) => menu !== null);

  // Collect all menu items recursively for management
  function collectAllMenuItems(items: Menuitem[]): {
    title: string;
    isTopLevel: boolean;
    parentTitle?: string;
    depth: number;
  }[] {
    const collected: {
      title: string;
      isTopLevel: boolean;
      parentTitle?: string;
      depth: number;
    }[] = [];

    function crawl(items: Menuitem[], depth = 0, parentTitle?: string) {
      for (const item of items) {
        if (item.title) {
          // This item has a title, so it's a real menu item
          collected.push({
            title: item.title,
            isTopLevel: depth === 0,
            parentTitle,
            depth,
          });

          if (item.items) {
            crawl(item.items, depth + 1, item.title);
          }
        } else if (item.items) {
          // This is a titleless container - crawl its children at the same depth
          // Don't increment depth for titleless containers
          crawl(item.items, depth, parentTitle);
        }
      }
    }

    crawl(items);
    return collected;
  }

  $: allItems = collectAllMenuItems(filteredMenuItems);
  $: topLevelMenus = allItems.filter((item) => item.isTopLevel);

  // Filter out sub-menu items whose top-level parent is hidden
  $: visibleSubMenuItems = allItems
    .filter((item) => !item.isTopLevel)
    .filter((item) => {
      // Find the top-level parent for this item
      const topLevelParent = findTopLevelParent(item, allItems);
      // Only show if the top-level parent is not hidden
      return !topLevelParent || !$hiddenMenuItems[topLevelParent];
    });

  // Helper function to find the top-level parent of an item
  function findTopLevelParent(
    item: { title: string; parentTitle?: string },
    allItems: Array<{
      title: string;
      isTopLevel: boolean;
      parentTitle?: string;
    }>
  ): string | null {
    if (!item.parentTitle) return null;

    // Find the parent item
    const parent = allItems.find((i) => i.title === item.parentTitle);
    if (!parent) return null;

    // If parent is top-level, return its title
    if (parent.isTopLevel) return parent.title;

    // Otherwise, recursively find the top-level parent
    return findTopLevelParent(parent, allItems);
  }

  function toggleMenuVisibility(title: string) {
    $hiddenMenuItems[title] = !$hiddenMenuItems[title];
  }

  function toggleMenuCollapse(title: string) {
    $collapsedMenus[title] = !$collapsedMenus[title];
  }

  function showAllMenus() {
    // Clear all hidden items
    hiddenMenuItems.set({});
    // Clear all collapsed items
    collapsedMenus.set({});
  }
</script>

<div class="menu-preferences">
  <div class="reset-section">
    <button class="show-all-button" on:click={showAllMenus}>
      Show & Expand All
    </button>
    <p class="reset-description">Reset all menus to visible and expanded</p>
  </div>

  <div class="section">
    <h3>Top-Level Menus</h3>
    <p class="section-description">
      Control which menus are visible and whether they start collapsed
    </p>

    {#each topLevelMenus as menu}
      <div class="menu-item">
        <div class="menu-controls">
          <label class="checkbox-label">
            <input
              type="checkbox"
              checked={!$hiddenMenuItems[menu.title]}
              on:change={() => toggleMenuVisibility(menu.title)}
            />
            <span class="checkmark"></span>
            Visible
          </label>

          {#if !$hiddenMenuItems[menu.title]}
            <label class="checkbox-label secondary">
              <input
                type="checkbox"
                checked={!$collapsedMenus[menu.title]}
                on:change={() => toggleMenuCollapse(menu.title)}
              />
              <span class="checkmark"></span>
              Start expanded
            </label>
          {/if}
        </div>
        <div class="menu-title">{menu.title}</div>
      </div>
    {/each}
  </div>

  {#if visibleSubMenuItems.length > 0}
    <div class="section">
      <h3>Individual Menu Items</h3>
      <p class="section-description">Hide specific menu items within menus</p>

      {#each visibleSubMenuItems as item (item.title)}
        <div
          class="menu-item sub-item"
          style="padding-left: {item.depth * 1 + 1}em;"
        >
          <div class="menu-controls">
            <label class="checkbox-label">
              <input
                type="checkbox"
                checked={!$hiddenMenuItems[item.title]}
                on:change={() => toggleMenuVisibility(item.title)}
              />
              <span class="checkmark"></span>
              {#if !$hiddenMenuItems[item.title]}
                Visible
              {:else}
                Hidden
              {/if}
            </label>
          </div>
          <div class="menu-title">
            {item.title}
            {#if item.parentTitle}
              <span class="parent-indicator">in {item.parentTitle}</span>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .menu-preferences {
    display: flex;
    flex-direction: column;
    gap: 1.5em;
  }

  .reset-section {
    text-align: center;
    padding: 1em;
    border: 1px solid var(--lightgrey);
    border-radius: 0.5em;
    background-color: var(--lightestgrey, #f9f9f9);
  }

  .show-all-button {
    background-color: var(--blue);
    color: white;
    border: none;
    padding: 0.5em 1em;
    border-radius: 0.25em;
    cursor: pointer;
    font-size: var(--normal);
    transition: background-color 0.2s;
  }

  .show-all-button:hover {
    background-color: var(--darkblue, #0056b3);
  }

  .reset-description {
    margin: 0.5em 0 0 0;
    font-size: var(--small);
    color: var(--mediumgrey);
  }

  .section {
    border: 1px solid var(--lightgrey);
    border-radius: 0.5em;
    padding: 1em;
  }

  .section h3 {
    margin: 0 0 0.5em 0;
    color: var(--blue);
    font-size: var(--normal);
  }

  .section-description {
    margin: 0 0 1em 0;
    font-size: var(--small);
    color: var(--mediumgrey);
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 1em;
    padding: 0.5em 0;
    border-bottom: 1px solid var(--lightgrey);
  }

  .menu-item:last-child {
    border-bottom: none;
  }

  .sub-item {
    border-left: 2px solid var(--lightgrey);
  }

  .menu-controls {
    display: flex;
    gap: 1em;
    flex-shrink: 0;
  }

  .menu-title {
    flex: 1;
    font-weight: var(--normal);
  }

  .parent-indicator {
    font-size: var(--small);
    color: var(--mediumgrey);
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5em;
    cursor: pointer;
    font-size: var(--small);
    white-space: nowrap;
  }

  .checkbox-label.secondary {
    color: var(--mediumgrey);
  }

  .checkbox-label input[type="checkbox"] {
    margin: 0;
  }

  .checkmark {
    font-size: var(--small);
  }

  /* Better checkbox styling could go here if desired */
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
  }
</style>
