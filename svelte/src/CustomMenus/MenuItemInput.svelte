<script lang="ts">
  import { customMenuStore } from "./customMenu";
  import type { Menuitem } from "../types";
  export let editMode = false;
  let response;
  let error;
  let lookingUp;

  const apiurl = `https://script.google.com/macros/s/AKfycbya693TbXoSRcP8OHEaibaximOXlb4x4FB0ZGFGHZNvyAUI2Vz-ON4bw6QLRDSjO2MI7A/exec`;

  async function onUrlChange() {
    if (lookedUp) {
      return;
    }
    lookingUp = true;
    if (menuItem.link.indexOf("//") == -1) {
      menuItem.link = "//" + menuItem.link;
    }
    try {
      var url = new URL(menuItem.link, location.origin);
    } catch (err) {
      error = "Invalid URL";
    }
    menuItem.link = url.toString();
    let lookupUrl = apiurl + "?url=" + menuItem.link;

    console.log("Lookup", lookupUrl);
    try {
      response = await fetch(lookupUrl, { redirect: "follow" });
      var data = await response.json();
    } catch (err) {
      console.log("Error looking up data", err);
      lookedUp = menuItem.link;
      lookingUp = false;
      return;
    }
    menuItem.title = data.title;
    menuItem.icon = new URL(data.icon, menuItem.link).toString();
    lookedUp = menuItem.link;
    lookingUp = false;
  }

  export let menuItem: Menuitem = {
    title: "",
    link: "",
    icon: "",
    detail: "",
  };
  export let onAdd = (menuItem) =>
    window.alert(`Adding link? ${JSON.stringify(menuItem)}`);

  function addUrl() {
    onAdd(menuItem);
  }

  let lookedUp: string | boolean = false;

  function confirmUrl() {
    lookedUp = false;
    onUrlChange();
  }
</script>

<div class="grid">
  <label for="custom-url">URL:</label>
  <div class="flex">
    <input id="custom-url" bind:value={menuItem.link} on:change={onUrlChange} />
    {#if lookedUp != menuItem.link}
      <button class="span-2" disabled={lookingUp} on:click={confirmUrl}
        >🔍</button
      >
    {/if}
  </div>

  {#if lookedUp || editMode}
    <label for="custom-title">Link Name</label>
    <input id="custom-title" bind:value={menuItem.title} />
    <label for="custom-icon">Icon URL: </label>
    <div class="flex">
      <input id="custom-icon" bind:value={menuItem.icon} />
      {#if menuItem.icon}
        <img src={menuItem.icon} style="width:48px" />
      {/if}
    </div>
    <label for="custom-detail">Description:</label>
    <input id="custom-detail" bind:value={menuItem.detail} />
    <button class="span-2" on:click={addUrl}>
      {#if editMode}
        ✓
      {:else}
        +{/if}</button
    >
  {/if}
</div>
<div>
  {#if error}
    Error: {error}
  {/if}
</div>

<style>
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
    background-color: var(--white);
    padding: var(--pad);
  }
  .span-2 {
    grid-column-start: 1;
    grid-column-end: 3;
    justify-self: end;
  }
  .flex {
    display: flex;
  }
  input {
    min-width: 20em;
  }
</style>
