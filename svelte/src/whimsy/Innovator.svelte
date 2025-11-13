<script lang="ts">
  import VideoPlayer from "../whimsy/VideoPlayer.svelte";
  import VideoPlayerToast from "./VideoPlayerToast.svelte";
  import { school, whimsy, videoPlayerToastClicked } from "../prefs";
  let edition = 3;
</script>

{#if $school === "HS" || $school === "All"}
  <!-- Video Player Toast -->
  {#if $whimsy && $school === "HS"}
    <VideoPlayerToast
      toastIndex={edition}
      visible={$school === "HS" || $school == "All"}
    >
      <span class="text"
        >Check out the new Video from <i>The Innovator</i>!</span
      >
    </VideoPlayerToast>
  {/if}
  <VideoPlayer
    id={`innovator-${edition}`}
    videoLinks={[
      {
        //url: "https://drive.google.com/file/d/1hfkpi9fTaXuvqUD6uNkpBOYySJKz_Nof/view?usp=sharing",
        url: "https://drive.google.com/file/d/1FN18cyyGEbl9DqEWCBx4HK7nmrod2vwV/view?usp=drive_link",
        type: "google-drive",
        title: "Innovator Third Video Edition: A Harvest of Memories",
        tabtitle: "Drive",
      },
      {
        url: "https://www.youtube.com/watch?v=xG5rpfxizKY",
        type: "youtube",
        title: "Innovator Third Video Edition: A Harvest of Memories",
        tabtitle: "YouTube",
      },
    ]}
  >
    <a slot="footer-extra" href="https://theinnovator.org">
      See more at theinnovator.org
    </a>
  </VideoPlayer>
{/if}

<style>
  :global(h1, h2, h3, h4, h5, h6) {
    font-weight: var(--bold);
  }
  :root {
    --white: white;
    --black: black;
    --darkgrey: #373737;
    --mediumgrey: #4a4a4a;
    --lightgrey: #aaa;
    --blue: #0033a0;
    --red: #c6093b;
    --darkshadow: #000000e1;
    --tiny: 10px;
    --small: 12px;
    --normal: 16px;
    --big: 24px;
    --huge: 48px;
    --icon-size: 32px;
    --skinny: 200;
    --bold: 500;
    --spacer: 12px;
    --dark-overlay: #000c;
    --light-text: #efefff;
    --cursive: "Tangerine", cursive;
    --pad: 4px;
    --card-width-small: calc(min(200px, 100vw));
    --card-width: calc(min(404px, 100vw));
    --card-width-double: calc(min(808px, 100vw));
    --bar-height: 48px;
    --medium-big-screen: 1100px;
    --smaller-screen: 800px;
    --off-white: #fffef9;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --off-white: #0d0d11;
      --white: black;
      --black: white;
      --darkgrey: #cfcfcf;
      --lightgrey: #515151;
      --mediumgrey: #afafaf;
      --blue: #a4c1ff;
      --red: #f9b4c7;
      --darkshadow: #ffffffd1;
    }
  }

  .overlay {
    position: fixed;
    opacity: 1;
    background-color: var(--darkshadow);
    display: grid;
    place-content: center;
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    top: 0;
    left: 0;
    z-index: 99;
  }
  .overlay > :global(button) {
    position: absolute;
    right: var(--spacer);
    top: var(--spacer);
    background-color: var(--white);
  }
  .hidden {
    color: transparent;
  }
</style>
