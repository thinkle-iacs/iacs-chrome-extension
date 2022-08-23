<script lang="ts">
  import { school } from "./prefs";
  import type { Menuitem } from "./types";
  export let mi: Menuitem;
</script>

<a href={mi.link} class="menuitem">
  <div class="icon-holder" class:black={mi.blackIcon}>
    {#if mi.icon}
      <img class="icon" src={mi.icon} alt={mi.title + " icon"} />
    {/if}
  </div>
  <div class="content">
    <div class="title">{mi.title}</div>
    {#if mi.detail}
      <div class="detail">
        {@html mi.detail}
      </div>
    {/if}
  </div>
</a>

<style>
  a {
    color: inherit;
    text-decoration: none;
  }
  a:hover {
    background-color: var(--blue);
    color: #ffffff;
  }
  a:hover :global(a) {
    font-weight: var(--bold);
    color: var(--lightgrey);
  }

  a:hover .black img {
    -webkit-filter: grayscale(1) invert(1);
    filter: grayscale(1) invert(1);
  }
  a .black img {
    transition: filter, -webkit-filter 350ms;
  }
  .detail {
    font-size: var(--small);
    font-weight: var(--skinny);
  }
  .title {
    /* font-weight: var(--bold); */
    font-size: var(--normal);
  }
  .icon {
    max-width: var(--icon-size, 32px);
    max-height: var(--icon-size, 32px);
  }
  .icon-holder {
    width: var(--icon-size);
    height: var(--icon-size);
    display: grid;
    place-content: center;
  }
  .content {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    gap: 1px;
  }
  .menuitem {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    gap: 2px;
    padding: var(--pad);
    transition: background-color 350ms;
  }
  @media (prefers-color-scheme: dark) {
    .black img {
      filter: grayscale(1) invert(1);
      -webkit-filter: grayscale(1) invert(1);
    }
    a:hover .black img {
      filter: invert(0);
      -webkit-filter: invert(0);
    }
  }
</style>
