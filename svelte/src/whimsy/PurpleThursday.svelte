<script>
  import { onMount } from "svelte";

  let hide = false;
  let animating = false;

  // Function to update colors based on the current color scheme
  function updateColors() {
    const isDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (!hide && animating) {
      document.documentElement.style.setProperty(
        "--red",
        isDarkMode
          ? "var(--material-color-purple-100)"
          : "var(--material-color-purple-900)"
      );
      document.documentElement.style.setProperty(
        "--blue",
        isDarkMode
          ? "var(--material-color-purple-200)"
          : "var(--material-color-purple-600)"
      );
    } else {
      document.documentElement.style.setProperty("--red", "");
      document.documentElement.style.setProperty("--blue", "");
    }
  }

  // Watch for changes in the color scheme
  onMount(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateColors);

    // Initial call to set the colors
    updateColors();

    return () => {
      mediaQuery.removeEventListener("change", updateColors);
    };
  });

  $: updateColors(hide, animating);
</script>

{#if !hide}
  <div
    class:notAnimated={!animating}
    on:animationstart={() => (animating = true)}
    on:click={() => (hide = true)}
  >
    It's purple Thursday
  </div>
{/if}

<style>
  .notAnimated {
    opacity: 0;
  }
  div {
    display: grid;
    place-content: center;
    text-align: center;
    background-color: var(--material-color-purple-600);
    color: white;
    padding: 1em;
    font-size: var(--normal);
    position: fixed;
    bottom: 50px;
    right: -100px;
    padding-left: 100px;
    padding-right: 100px;
    transform: rotate(-45deg);
    animation-name: slide-in;
    animation-duration: 1s;
    animation-delay: 2s;
    animation-iteration-count: 1;
    z-index: 99;
  }

  @keyframes slide-in {
    0% {
      right: -500px;
      bottom: 50vh;
      transform: rotateX(45deg) rotate(5deg);
    }
    100% {
      right: -100px;
      bottom: 50px;
      transform: rotate(-45deg);
    }
  }
</style>
