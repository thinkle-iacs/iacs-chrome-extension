<script lang="ts">
  import GoogleTranslate from "./GoogleTranslate.svelte";

  import TimeDisplay from "./TimeDisplay.svelte";
  export let mode = "Staff";
  import Menu from "./Menu.svelte";
  import MenuItem from "./MenuItem.svelte";
  import {
    WEBSITE,
    STAFF_DIRECTORY,
    SCHOOL_CALENDAR,
  } from "./menus/commonMenuItems";
</script>

<div class="top">
  <div class="logo-block">
    <img src="./icons/IACS_logo.png" />
    <h1>
      {#if mode == "Family"}
        Family Page
      {:else}
        Launcher <span class="mode">{mode}</span>
      {/if}
    </h1>
  </div>
  {#if mode !== "Family"}
    <TimeDisplay {mode} />
  {/if}
  {#if mode == "Family"}
    <div class="family-links">
      <GoogleTranslate></GoogleTranslate>
      <div class="top-links">
        <MenuItem mi={WEBSITE} editable={false} />
        <MenuItem editable={false} mi={SCHOOL_CALENDAR} />
        <MenuItem mi={STAFF_DIRECTORY} editable={false} />
      </div>
    </div>
  {/if}
</div>

<style>
  @media screen and (max-width: 1100px) {
    h1 {
      display: none;
    }
  }
  .top {
    display: flex;
    flex-direction: row;
    align-items: end;
    justify-content: space-between;
    border-bottom: 3px solid var(--red);
    margin-bottom: calc(2 * var(--pad));
    margin-left: var(--pad);
    margin-right: var(--pad);
  }

  h1 {
    color: var(--blue);
    text-transform: uppercase;
    font-size: var(--huge);
    font-weight: 100;
    margin: 0;
    white-space: nowrap;
  }
  h1 .mode {
    text-transform: none;
    font-size: var(--normal);
  }
  img {
    height: var(--huge);
  }
  .logo-block {
    display: flex;
    gap: var(--pad);
    justify-content: center;
    align-items: center;
    height: calc(var(--huge)+var(--pad)+var(--pad));
    padding-bottom: var(--pad);
  }
  @media screen and (max-width: 800px) {
    .logo-block {
      display: none;
    }
    .top,
    .top :global(*) {
      flex-wrap: wrap;
    }
  }

  @media (prefers-color-scheme: dark) {
    img {
      filter: grayscale(1) invert(1);
      -webkit-filter: grayscale(1) invert(1);
    }
  }
  .family-links {
    display: flex;
    flex-direction: row;
    gap: var(--pad);
    align-items: center;
  }
  .top-links {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
  @media screen and (max-width: 800px) {
    .family-links {
      flex-direction: column-reverse;
      gap: 0;
    }
  }
</style>
