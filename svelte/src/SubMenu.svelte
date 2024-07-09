<script lang="ts">
  import { fly } from "svelte/transition";
  import MenuItem from "./MenuItem.svelte";
  import { collapsedMenus, hiddenMenuItems, school, SchoolType } from "./prefs";

  type Menuitem = {
    link?: string;
    items?: Menuitem[];
    detail?: string;
    icon?: string;
    title: string;
    school?: SchoolType;
  };
  export let menuitem: Menuitem;
</script>

<nav>
  {#if !$school || $school == "All" || !menuitem.school || menuitem.school == $school}
    {#if menuitem.link && !menuitem.items}
      <MenuItem mi={menuitem} />
    {:else if menuitem.title}
      <h2
        on:click={() => {
          $collapsedMenus[menuitem.title] = !$collapsedMenus[menuitem.title];
        }}
      >
        {#if menuitem.items}
          <button
            class="collapse"
            class:collapsed={$collapsedMenus[menuitem.title]}
            aria-label="Collapse"
          ></button>
        {/if}
        {menuitem.title}
        {#if menuitem.link}
          <a href={menuitem.link} on:click|stopPropagation>↗</a>
        {/if}
      </h2>
    {/if}
    {#if menuitem.items && !$collapsedMenus[menuitem.title]}
      <ul>
        {#each menuitem.items as mi, n}
          {#if !$hiddenMenuItems[mi.title] && (!mi.school || !$school || $school == "All" || mi.school == $school)}
            {#if mi.items}
              <li
                class="sub"
                class:headless={!menuitem.title && n == 0}
                transition:fly={{ y: -200 }}
              >
                <svelte:self menuitem={mi} />
              </li>
            {:else}
              <li transition:fly={{ y: -200 }}>
                <MenuItem {mi} />
              </li>
            {/if}
          {/if}
        {/each}
      </ul>
      <!-- Hidden items -->
      {#if menuitem.items.find((i) => $hiddenMenuItems[i.title])}
        <div class="hidden-container">
          {#each menuitem.items as mi}
            {#if $hiddenMenuItems[mi.title]}
              <MenuItem {mi} />
            {/if}
          {/each}
        </div>
      {/if}
    {/if}
  {/if}
</nav>

<style>
  h2 {
    margin-top: 0;
    margin-bottom: var(--spacer);
  }
  nav {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: start;
    align-items: start;
  }
  ul {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    list-style: none;
  }
  ul li {
    width: 100%;
    margin-bottom: var(--spacer);
  }
  .sub {
    margin-top: var(--spacer);
    border-top: 1px solid var(--lightgrey);
    padding-top: var(--pad);
  }
  .sub:first-child {
    border-top: 0px;
    padding-top: inherit;
  }
  h2 {
    font-size: var(--normal);
    color: var(--mediumgrey);
  }
  .collapse {
    color: transparent;
    border: none;
    background-color: transparent;
    --height: var(--small);
    /* divide by sqrt(3) -- 30/60/90 triangle
       in the middle of our equilateral triangle */
    --side: calc(var(--height) / 1.73205080757);
    /* Let's build a triangle out of the top border! */
    border-top: var(--height) solid var(--black);
    border-left: var(--side) solid transparent;
    border-right: var(--side) solid transparent;
    border-bottom: none;
    width: 0;
    height: 0;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    transition: scale 300ms;
  }
  h2:hover .collapse {
    scale: 1.1;
  }
  .collapsed {
    transform: rotate(-90deg);
  }
  ul {
    /* Allow tool-tips to show up on the X axis, but clip us
    on the y to let our menu "slide in" naturally */
    overflow-y: clip;
    overflow-x: visible;
    position: relative;
  }
  .hidden-container {
    display: flex;
    flex-direction: row;
    gap: var(--small);
    justify-content: center;
    align-items: center;
    width: 100%;
    height: var(--small);
    opacity: 0;
    transition: opacity 300ms;
  }
  nav:hover .hidden-container {
    opacity: 1;
  }
  .headless {
    margin-top: 0;
  }
</style>
