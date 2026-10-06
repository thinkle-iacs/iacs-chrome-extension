<script lang="ts">
  import { fly } from "svelte/transition";
  import { videoPlayerToastClicked } from "../prefs";

  export let visible: boolean = false;
  export let toastIndex = 2;

  function handleClick() {
    // Scroll to video player
    const videoPlayer = document.getElementById("video-player");
    if (videoPlayer) {
      // Scroll so the video player lands near the top of the screen
      const rect = videoPlayer.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const offset = rect.top + scrollTop - 40; // 40px offset from top
      window.scrollTo({ top: offset, behavior: "smooth" });
    }

    // Mark as clicked and hide
    videoPlayerToastClicked.set(toastIndex);
  }
</script>

{#if visible && $videoPlayerToastClicked !== toastIndex}
  <div
    class="video-toast"
    transition:fly={{
      y: -100,
      duration: 800,
      easing: (t) => t * t * (3 - 2 * t),
    }}
    on:click={handleClick}
  >
    <div class="toast-content">
      <slot></slot>
    </div>
  </div>
{/if}

<style>
  .video-toast {
    position: fixed;
    bottom: 60px;
    right: 30%;
    transform: translateX(-50%);
    z-index: 1000;
    cursor: pointer;
    animation: settle 600ms ease-out;
  }

  .toast-content {
    background: var(--red);
    color: var(--white);
    padding: 12px 20px;
    border-radius: 25px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: var(--bold);
    font-size: var(--small);
    white-space: nowrap;
    border: 2px solid var(--white);
  }

  .text {
    flex: 1;
    text-align: center;
  }

  @keyframes settle {
    0% {
      transform: translateX(-50%) translateY(-6px) scale(1.04);
    }
    100% {
      transform: translateX(-50%) translateY(0) scale(1);
    }
  }

  .video-toast:hover {
    transform: translateX(-50%) scale(1.05);
  }

  .video-toast:hover .toast-content {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  }
</style>
