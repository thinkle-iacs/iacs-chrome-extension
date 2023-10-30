<script>
  import { onMount } from "svelte";
  import FollowMouse from "./FollowMouse.svelte";

  onMount(() => {});

  const halloweenTheme = {
    font: "https://fonts.googleapis.com/css2?family=Macondo&family=Poltawski+Nowy:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap",
    props: {
      "--custom-body-font": "'Poltawski Nowy', serif",
      "--custom-head-font": "Macondo, cursive, serif",
      "--theme-bg": "var(--material-color-deep-orange)",
      "--theme-fg": "black",
      "--white": "black",
      "--black": "var(--material-color-amber-200)",
      "--darkgrey": "var(--material-color-amber-700)",
      "--mediumgrey": "var(--material-color-amber-400)",
      "--lightgrey": "var(--material-color-deep-purple)",
      "--red": "var(--material-color-deep-purple-a400)",
      "--blue": "var(--material-color-deep-orange)",
      "--off-white": "var(--material-color-deep-purple-900)",
    },
  };

  let theme = halloweenTheme;

  $: {
    if (!hide && animating) {
      setCustomProperties(true, theme.props);
    } else {
      setCustomProperties(false, theme.props);
    }
  }
  function setCustomProperties(on, themeProperties) {
    for (let property in themeProperties) {
      if (!hide && animating) {
        document.documentElement.style.setProperty(
          property,
          themeProperties[property]
        );
        document.body.classList.add("holiday");
      } else {
        document.documentElement.style.removeProperty(property);
        document.body.classList.remove("holiday");
      }
    }
  }

  let hide = false;
  let animating = false;
</script>

<svelte:head>
  {#if !hide && animating && theme.font}
    <link rel="stylesheet" href={theme.font} />
  {/if}
</svelte:head>
{#if !hide}
  <FollowMouse
    speed={10}
    x={400}
    y={-100}
    prefs={{
      updateDelay: 700,
      speedJitter: 15,
      targetJitter: 100,
      targetJitterProb: 0.01,
      randomTargetResetThreshhold: 15000,
    }}><div class="ghost">👻</div></FollowMouse
  >
  <FollowMouse
    speed={75}
    x={-200}
    y={800}
    prefs={{
      updateDelay: 5,
      speedJitter: 0,
      rotate: true,
      targetJitterProb: 0.5,
      targetJitter: 60,
      maxSpeed: 150,
      randomTargetResetThreshhold: 15000,
    }}><div class="spider">🕷️</div></FollowMouse
  >
  <div
    class="banner"
    class:notAnimated={!animating}
    on:animationstart={() => (animating = true)}
    on:click={() => (hide = true)}
  >
    Happy Halloween!
  </div>
{/if}

<style>
  :global(.holiday) {
    font-family: var(--custom-body-font, inherit);
  }
  :global(
      .holiday h1,
      .holiday h2,
      .holiday h3,
      .holiday h4,
      .holiday h5,
      .holiday h6,
      .holiday .title
    ) {
    font-family: var(--custom-head-font, inherit);
  }
  .notAnimated {
    opacity: 0;
  }
  div.banner {
    display: grid;
    font-family: var(--theme-font, var(--custom-head-font));
    place-content: center;
    text-align: center;
    background: var(--theme-bg);
    color: var(--theme-fg);
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
  .ghost {
    opacity: 0.3;
    filter: drop-shadow(10px, 10px, #fffa);
    font-size: 70px;
  }
  .spider {
    font-size: 32px;
    filter: drop-shadow(1px 1px #fff);
    transform: rotate(-90deg);
  }
</style>
