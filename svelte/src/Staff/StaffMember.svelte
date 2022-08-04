<script context="module" language="typescript">
  let imageCache = {};
</script>

<script lang="typescript">
  export let showName = true;
  export let showRole = true;
  import type { StaffData } from "./types";
  export let staffMember: StaffData;
  let imageUrl;
  async function getImage(id) {
    if (imageCache[id]) {
      imageUrl = imageCache[id];
    } else {
      let response = await fetch(
        `https://www.innovationcharter.org/wp-json/wp/v2/media/${id}`
      );
      let json = await response.json();
      console.log("Fetched media!");
      console.log(json);
      let originalUrl = json.source_url;
      let imageDataResponse = await fetch(originalUrl);
      let imageData = await imageDataResponse.blob();
      console.log("Got image data!", imageData);
      imageUrl = URL.createObjectURL(imageData);
      imageCache[id] = imageUrl;
    }
  }

  $: if (staffMember.acf.profile_image) {
    getImage(staffMember.acf.profile_image);
  }
</script>

<div class="staff-box">
  {#if imageUrl}
    <img src={imageUrl} />
  {:else}
    <div class="image-placeholder">
      fetching image {staffMember.acf.profile_image}
    </div>
  {/if}
  {#if showName}
    <h4>
      {staffMember.acf.first_name}
      {staffMember.acf.last_name}
    </h4>
  {/if}
  {#if showRole}
    <h5>{@html staffMember.acf.staff_title}</h5>
  {/if}
  {#if showRole || showName}
    <a target="_blank" href={staffMember.link}>See full bio</a>{/if}
</div>

<style>
  .staff-box {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    padding: var(--pad);
    gap: var(--pad);
  }
  img {
    border-bottom: var(--pad) solid var(--lightgrey);
  }
  .image-placeholder {
    width: 200px;
    height: 200px;
    background-color: var(--lightgrey);
  }

  img {
    max-width: 200px;
    max-height: 200px;
  }
  h4,
  h5 {
    margin: 0;
  }
</style>
