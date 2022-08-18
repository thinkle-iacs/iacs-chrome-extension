<script lang="ts">
  import MenuItem from "./MenuItem.svelte";

  type Menuitem = {
    link?: string;
    items?: Menuitem[];
    detail?: string;
    icon?: string;
    title: string;
  };
  export let menuitem: Menuitem;
</script>

<nav>
  {#if menuitem.link}
    <MenuItem mi={menuitem} />
  {:else}
    <h2>{menuitem.title}</h2>
  {/if}
  {#if menuitem.items}
    <ul>
      {#each menuitem.items as mi}
        {#if mi.items}
          <li class="sub">
            <svelte:self menuitem={mi} />
          </li>
        {:else}
          <li>
            <MenuItem {mi} />
          </li>
        {/if}
      {/each}
    </ul>
  {/if}
</nav>

<style>
  .icon {
    width: 32px;
    height: 32px;
  }
  h2 {
    margin: 0;
  }
  nav {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 10px;

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
    margin-bottom: var(--space);
  }
  .menuitem {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    gap: 2px;
  }

  .sub {
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
