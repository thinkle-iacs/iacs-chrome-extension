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

  let madGhost = false;
  function triggerGhostMadness() {
    madGhost = !madGhost;
    return true;
  }
  let spiderSwarm = [];
  let spiderPrefs = {
    updateDelay: 5,
    speedJitter: 0,
    rotate: true,
    targetJitterProb: 0.5,
    targetJitter: 60,
    maxSpeed: 150,
    randomTargetResetThreshhold: 15000,
  };
  function triggerSpiderSwarm() {
    console.log("Swarm of spiders?");
    if (!spiderSwarm.length) {
      for (let i = 0; i < Math.random() * 5 + 10; i++) {
        spiderSwarm.push({
          x: window.innerWidth * Math.random(),
          y: window.innerHeight * Math.random(),
        });
      }
      spiderSwarm = spiderSwarm; // react!
    } else {
      spiderSwarm = [];
    }
    return true;
  }
  const makeZombie = () => ({
    x: Math.random() * window.innerWidth,
    y: window.innerHeight - 35 - Math.random() * 25,
  });
  let zombieSwarm = [makeZombie(), makeZombie(), makeZombie(), makeZombie()];
  function addToZombieSwarm() {
    for (let i = 0; i < Math.random() * 2 + 10; i++) {
      zombieSwarm = [...zombieSwarm, makeZombie()];
    }
  }
</script>

<svelte:head>
  {#if !hide && animating && theme.font}
    <link rel="stylesheet" href={theme.font} />
  {/if}
</svelte:head>
{#if !hide}
<!-- Temporarily disable animations -->
 <!--
  <FollowMouse
    onClick={triggerGhostMadness}
    speed={10}
    x={400}
    y={-100}
    prefs={{
      updateDelay: 700,
      speedJitter: 15,
      targetJitter: 100,
      targetJitterProb: 0.01,
      randomTargetResetThreshhold: 15000,
    }}
    ><div
      class="ghost"
      class:mad={madGhost}
      on:animationend={() => (madGhost = false)}
    >
      👻
    </div></FollowMouse
  >
  <FollowMouse
    speed={75}
    x={-200}
    y={800}
    prefs={spiderPrefs}
    onClick={triggerSpiderSwarm}><div class="spider">🕷️</div></FollowMouse
  >
  {#each spiderSwarm as spider}
    <FollowMouse
      speed={75}
      x={spider.x}
      y={spider.y}
      prefs={spiderPrefs}
      onClick={triggerSpiderSwarm}><div class="spider">🕷️</div></FollowMouse
    >
  {/each}

  {#each zombieSwarm as zombie, n}
    <FollowMouse
      speed={5}
      x={zombie.x}
      y={zombie.y}
      prefs={{
        lockYPos: true,
        flipX: true,
      }}
      onClick={addToZombieSwarm}
      ><div class="zombie">
        {#if n % 2}
          🧟
        {:else if n % 13 == 0}
          <span style="font-size: 25%;">🧠</span>
        {:else}
          🧟‍♂️
        {/if}
      </div></FollowMouse
    >
  {/each}
-->

  <div
    class="banner"
    class:notAnimated={!animating}
    on:animationstart={() => (animating = true)}
    on:click={() => (hide = true)}
  >
    Happy Halloween!
    <div class="close">Click to end the fun :-(</div>
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
  .mad {
    animation-name: mad;
    animation-duration: 5s;
    animation-iteration-count: 2;
    animation-direction: alternate;
  }
  @keyframes mad {
    0% {
      transform: rotate(0deg);
    }
    10% {
      transform: skewX(10deg) rotate(5deg);
    }
    20% {
      transform: skewX(-10deg) rotate(-5deg);
    }
    50% {
      transform: skewY(15deg) scalerotate(360deg);
    }
    100% {
      transform: scale(10) rotate(920deg);
      opacity: 1;
    }
  }
  .zombie {
    font-size: 50px;
    filter: drop-shadow(1px 1px #fff);
  }
  .banner > div {
    opacity: 0;
    font-size: var(--small);
    transition: all 300ms;
  }
  .banner:hover > div {
    opacity: 1;
  }
</style>
