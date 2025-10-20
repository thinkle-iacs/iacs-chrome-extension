<script lang="ts">
  import Card from "../Card.svelte";
  export let id;
  export let videoLinks: {
    url: string;
    type: "youtube" | "vimeo" | "direct" | "google-drive";
    title?: string;
    tabtitle?: string;
  }[] = [];
  let title;
  let activeIndex = 0;
</script>

<Card double {id}>
  <div slot="head">
    {videoLinks[activeIndex].title || "An Exciting Video!"}
    <span id="video-player"></span>
  </div>
  <div class="player" slot="body">
    {#each videoLinks as { url, type, title }, i}
      <div class="video" class:active={i == activeIndex}>
        {#if type == "direct"}
          <video controls style="width: 100%; max-width: 100%;">
            <source src={url} />
            Your browser does not support the video tag.
          </video>
        {:else if type == "youtube"}
          <iframe
            src={`https://www.youtube.com/embed/${url.split("v=")[1]}`}
            frameborder="0"
            allowfullscreen
            {title}
            style="width: 100%; aspect-ratio: 16/9; min-height: 200px;"
          ></iframe>
        {:else if type == "google-drive"}
          <iframe
            src={`https://drive.google.com/file/d/${url.split("/d/")[1].split("/")[0]}/preview`}
            frameborder="0"
            allowfullscreen
            {title}
            style="width: 100%; aspect-ratio: 16/9; min-height: 200px;"
          ></iframe>
        {:else if type == "vimeo"}
          <iframe
            src={`https://player.vimeo.com/video/${url.split(".com/")[1]}`}
            frameborder="0"
            allowfullscreen
            {title}
            style="width: 100%; aspect-ratio: 16/9; min-height: 200px;"
          ></iframe>
        {/if}
      </div>
    {/each}
  </div>
  <div slot="footer" class="tab-bar">
    {#if videoLinks.length > 1}
      <!-- Tabbed interface for changing the active video -->
      <div class="button-group">
        {#each videoLinks as { title, tabtitle }, j}
          <button
            class="tab"
            class:active={activeIndex == j}
            on:click={() => {
              activeIndex = j;
            }}
          >
            {#if tabtitle}
              {tabtitle}
            {:else}
              {title ? title : `Video ${j + 1}`}
            {/if}
          </button>
        {/each}
      </div>
    {/if}
    <slot name="footer-extra"></slot>
  </div>
</Card>

<style>
  .player {
    aspect-ratio: 16/9;
  }
  .player > div.video {
    display: none;
  }
  .player > div.video.active {
    display: block;
  }
  .tab-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
    width: 100%;
    align-items: center;
    flex-grow: 1;
  }
  .button-group {
    display: flex;
    gap: 0.5rem;
    justify-content: start;
    align-items: center;
  }
  .tab {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
    justify-content: center;
  }
  .tab.active {
    background-color: var(--blue, yellow);
    color: var(--white, white);
  }
</style>
