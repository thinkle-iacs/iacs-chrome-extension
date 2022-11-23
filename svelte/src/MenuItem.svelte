<script lang="ts">
  import { school } from "./prefs";
  import type { Menuitem } from "./types";
  export let mi: Menuitem;
  import MenuItemInput from "./CustomMenus/MenuItemInput.svelte";
  import { customManager } from "./CustomMenus/customMenu";

  let showingMenu = false;
  let showInput = false;
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
</script>

<div class="linkholder menuitem">
  <a href={mi.link}>
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
  {#if mi.editable}
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
    </div>
  {/if}
</div>

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

  .editbutton {
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
    .linkholder:hover .black img {
      filter: invert(0);
      -webkit-filter: invert(0);
    }
  }
</style>
