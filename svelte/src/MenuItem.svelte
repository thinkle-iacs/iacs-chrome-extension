<script lang="ts">
  import { hiddenMenuItems, school } from "./prefs";
  import { showSettingsToast } from "./toastStore";
  import type { Menuitem } from "./types";
  export let mi: Menuitem;
  export let editable = true;
  export let mode: "Staff" | "HS" | "MS" | "Family" = "Staff";
  import MenuItemInput from "./CustomMenus/MenuItemInput.svelte";
  import { customManager } from "./CustomMenus/customMenu";
  import TooltipContainer from "./util/TooltipContainer.svelte";
  let showingMenu = false;
  let showInput = false;
  let error = false;
  let lastImage = "";
  $: if (mi.icon !== lastImage) {
    lastImage = mi.icon;
    error = false;
  }

  function showEditMenu(e) {
    e.preventDefault();
    showingMenu = true;
  }
  function edit(e) {
    e.preventDefault();
    showInput = true;
  }
  function deleteItem(e) {
    e.preventDefault();
    customManager.deleteItem(mi);
  }
  function moveUp(e) {
    e.preventDefault();
  }
  function moveDown(e) {
    e.preventDefault();
  }

  function hideItem() {
    $hiddenMenuItems[mi.title] = true;
    showingMenu = false;
    // Show toast notification to guide user to settings
    showSettingsToast();
  }
</script>

{#if $hiddenMenuItems[mi.title]}
  <div class="hidden-item-wrapper">
    <TooltipContainer position={1}>
      <button
        slot="control"
        class="hidden-item"
        on:click={() => ($hiddenMenuItems[mi.title] = false)}
      >
        <div class="icon-holder" class:black={mi.blackIcon}>
          {#if mi.icon && !error}
            <img
              class="icon"
              src={mi.icon}
              alt={mi.title + " icon"}
              on:error={() => (error = true)}
            />
          {:else}
            {mi.title[0]}
          {/if}
        </div>
      </button>
      <div slot="tip" style="font-size:var(--small)">
        Un-hide {mi.title}
      </div>
    </TooltipContainer>
  </div>
{:else}
  <div class="linkholder menuitem">
    <a href={mi.link}>
      <div class="icon-holder" class:black={mi.blackIcon}>
        {#if mi.icon && !error}
          <img
            class="icon"
            src={mi.icon}
            alt={mi.title + " icon"}
            on:error={() => (error = true)}
          />
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
    {#if editable && mode !== "Family"}
      <button on:click={showEditMenu} class="editbutton">⋮</button>
    {/if}
    {#if showingMenu}
      <div
        class="modal-wrap"
        on:click={(e) => {
          e.preventDefault();
          showingMenu = false;
        }}
      />
      <div class="popup">
        {#if mi.editable}
          {#if showInput}
            <MenuItemInput
              menuItem={mi}
              editMode={true}
              onAdd={() => {
                customManager.updateItem(mi);
                showInput = false;
                showingMenu = false;
              }}
            />
          {:else}
            <button on:click={edit}>Edit</button>
            <button on:click={deleteItem}>Delete</button>
            <!-- <button on:click={moveUp}>Move Up</button>
          <button on:click={moveDown}>Move Down</button> -->
          {/if}
        {/if}
        {#if mode !== "Family"}
          <button on:click={hideItem}> Hide </button>
        {/if}
      </div>
    {/if}
  </div>
{/if}

<style>
  .modal-wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #fff2;
    z-index: 1;
  }
  .popup {
    position: absolute;
    right: 0;
    top: var(--pad);
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: var(--pad);
  }
  .popup button {
    margin-top: 0;
    margin-bottom: 0;
  }
  .popup button:hover {
    background-color: var(--blue);
    color: var(--white);
  }
  .menuitem:hover .editbutton {
    opacity: 1;
  }

  .editbutton {
    opacity: 0;
    color: inherit;
    border-color: transparent;
    background-color: inherit;
    margin-left: auto;
  }
  .editbutton:hover {
    border-color: var(--lightgrey);
  }
  a {
    display: contents;
  }
  .linkholder {
    color: inherit;
    text-decoration: none;
    position: relative;
  }
  .linkholder:hover {
    background-color: var(--blue);
    color: #ffffff;
  }
  .linkholder:hover :global(a) {
    font-weight: var(--bold);
    color: var(--lightgrey);
  }

  .linkholder:hover .black img {
    -webkit-filter: grayscale(1) invert(1);
    filter: grayscale(1) invert(1);
  }
  .linkholder .black img {
    transition:
      filter,
      -webkit-filter 350ms;
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
    width: var(--icon-size, 32px);
    height: var(--icon-size, 32px);
    object-fit: contain;
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
    gap: 8px;
    padding: var(--pad);
    transition: background-color 350ms;
  }
  @media (prefers-color-scheme: dark) {
    .black img {
      filter: grayscale(1) invert(1);
      -webkit-filter: grayscale(1) invert(1);
    }
    .linkholder:hover .black img {
      filter: invert(0);
      -webkit-filter: invert(0);
    }
  }

  .hidden-item-wrapper {
    width: calc(var(--icon-size) / 2);
    height: calc(var(--icon-size) / 2);
    display: grid;
    place-content: center;
  }
  .hidden-item {
    border-radius: 50%;
    -webkit-filter: saturate(0.3);
    filter: saturate(0.3);
    display: grid;
    place-content: center;
    scale: 0.5;
    transform-origin: center;
  }
</style>
