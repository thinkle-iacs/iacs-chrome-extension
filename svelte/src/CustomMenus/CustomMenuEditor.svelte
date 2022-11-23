<script lang="ts">
  import MenuItemInput from "./MenuItemInput.svelte";

  import { customMenuStore } from "./customMenu";
  import type { Menuitem } from "../types";
  let editMode = false;
  let newUrl: string;
  let response;
  let error;

  const apiurl = `https://script.google.com/macros/s/AKfycbya693TbXoSRcP8OHEaibaximOXlb4x4FB0ZGFGHZNvyAUI2Vz-ON4bw6QLRDSjO2MI7A/exec`;
  let newMenuItem: Menuitem = {
    title: "",
    link: "",
    icon: "",
  };

  function addUrl() {
    if ($customMenuStore.length == 0) {
      $customMenuStore = [{ title: "My Links", items: [] }];
    }
    $customMenuStore[0].items.push(newMenuItem);
    newMenuItem = { title: "", link: "", icon: "" };
    $customMenuStore = $customMenuStore;
  }
</script>

<button
  on:click={() => {
    editMode = !editMode;
  }}>+</button
>
{#if editMode}
  <div class="overlay">
    <div class="modal">
      <button class="close" on:click={() => (editMode = false)}>&times;</button>
      <h2>Custom Menu Items</h2>
      <MenuItemInput menuItem={newMenuItem} onAdd={addUrl} />
    </div>
  </div>
{/if}

<style>
  .modal {
    box-sizing: border-box;
    --width: min(calc(100vw - 20px), 600px);
    width: var(--width);
    min-height: 400px;
    position: absolute;
    left: calc(50vw - var(--width) / 2);
    top: calc(50vh - 300px);
    background-color: white;
    padding: 2em;
    box-shadow: 2px 2px #3338;
  }
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
    background-color: #fff8;
    z-index: 2;
  }

  button {
    position: relative;
    z-index: 2;
    border: none;
    background-color: unset;
    display: grid;
    place-content: center;
    width: 2em;
    height: 2em;
    border-radius: 50%;
    border: 1px solid var(--lightgrey);
  }
  .grid {
    display: grid;
    grid-template-columns: auto auto;
  }
  .span-2 {
    grid-column-start: 1;
    grid-column-end: 3;
    justify-self: end;
  }
  .close {
    position: absolute;
    right: var(--pad);
    top: var(--pad);
  }
</style>
