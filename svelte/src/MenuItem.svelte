<script lang="typescript">
  import type { Menuitem } from "./types";
  export let mi: Menuitem;
</script>

<a href={mi.link} class="menuitem">
  {#if mi.icon}
    <img class="icon" src={mi.icon} alt={mi.title + " icon"} />
  {:else}
    <div class="icon-placeholder" />
  {/if}
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
    font-weight: bold;
    color: rgb(184, 184, 217);
  }

  a:hover img {
    -webkit-filter: grayscale(0.7) invert(1);
    filter: grayscale(0.7) invert(1);
  }
  a img {
    transition: filter, -webkit-filter 350ms;
  }
  .detail {
    font-size: var(--small);
    font-weight: var(--skinny);
  }
  .title {
    font-weight: var(--bold);
    font-size: var(--big);
  }
  .icon {
    max-width: 32px;
    max-height: 32px;
  }
  .icon-placeholder {
    width: 32px;
    height: 32px;
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
</style>
