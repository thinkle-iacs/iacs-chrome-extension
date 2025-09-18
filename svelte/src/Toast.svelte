<script lang="ts">
  import { fly, fade } from "svelte/transition";
  import { onMount, onDestroy } from "svelte";

  export let message: string;
  export let duration: number = 4000;
  export let visible: boolean = false;
  export let highlightSettings: boolean = false;

  let toastElement: HTMLElement;
  let timer: NodeJS.Timeout | null = null;

  // Auto-hide after duration
  $: if (visible) {
    // Clear any existing timer
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      visible = false;
    }, duration);
  }

  // Cleanup timer on destroy
  onDestroy(() => {
    if (timer) clearTimeout(timer);
  });

  // Add/remove settings highlight class when needed
  $: if (highlightSettings) {
    const settingsButton = document.querySelector(".float-me button");
    if (settingsButton) {
      settingsButton.classList.add("highlight-settings");
      // Remove highlight when toast disappears
      const removeHighlight = () => {
        settingsButton.classList.remove("highlight-settings");
      };
      setTimeout(removeHighlight, duration);
    }
  }

  function closeToast() {
    visible = false;
  }
</script>

{#if visible}
  <div
    class="toast-container"
    bind:this={toastElement}
    transition:fly={{ y: 50, duration: 300 }}
  >
    <div class="toast">
      <div class="toast-content">
        <span class="toast-icon">💡</span>
        <span class="toast-message">{message}</span>
      </div>
      <button class="toast-close" on:click={closeToast}> × </button>
    </div>
  </div>
{/if}

<style>
  .toast-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    pointer-events: none;
  }

  .toast {
    background: var(--blue, #0066cc);
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 12px;
    max-width: 350px;
    pointer-events: auto;
    font-size: var(--small, 14px);
    line-height: 1.4;
  }

  .toast-content {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
  }

  .toast-icon {
    font-size: 18px;
    flex-shrink: 0;
  }

  .toast-message {
    flex: 1;
  }

  .toast-close {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    margin: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s;
    flex-shrink: 0;
  }

  .toast-close:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  /* Global styles for settings button highlighting */
  :global(.highlight-settings) {
    animation: pulse-highlight 2s ease-in-out 3;
    box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.4) !important;
    border-radius: 50% !important;
  }

  @keyframes pulse-highlight {
    0%,
    100% {
      box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.4);
    }
    50% {
      box-shadow: 0 0 0 8px rgba(255, 193, 7, 0.6);
    }
  }
</style>
