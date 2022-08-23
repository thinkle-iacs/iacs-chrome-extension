<script lang="ts">
  import MenuItem from "./MenuItem.svelte";
  import { school, SchoolType } from "./prefs";

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
    {#if menuitem.link}
      <MenuItem mi={menuitem} />
    {:else}
      <h2>{menuitem.title}</h2>
    {/if}
    {#if menuitem.items}
      <ul>
        {#each menuitem.items as mi}
          {#if !mi.school || !$school || $school == "All" || mi.school == $school}
            {#if mi.items}
              <li class="sub">
                <svelte:self menuitem={mi} />
              </li>
            {:else}
              <li>
                <MenuItem {mi} />
              </li>
            {/if}
          {/if}
        {/each}
      </ul>
    {/if}
  {/if}
</nav>

<style>
  .icon {
    width: var(--icon-size);
    height: var(--icon-size);
  }
  h2 {
    margin: 0;
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
</style>
