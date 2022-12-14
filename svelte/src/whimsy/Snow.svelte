<script>
  import { onMount, onDestroy } from "svelte";

  let animating = false;
  let lastAnimation = 0;
  let breeze = {
    vx: 4,
    vy: 0,
  };

  onMount(() => {
    startSnow();
  });
  onDestroy(() => {
    animating = false;
  });
  let maxBreeze = 10;

  function startSnow() {
    animating = true;
    makeFlakes();
    requestAnimationFrame(animateSnow);
    updateBreeze();
  }

  function updateBreeze() {
    breeze.vx += 100 - (Math.random() * 200) / 2;
    breeze.vy += 105 - (Math.random() * 10) / 2;
    let gustTime = Math.random() * 1000 * 30;
    if (Math.abs(breeze.vx) > maxBreeze) {
      breeze.vx *= 0.8;
    }
    if (Math.abs(breeze.vy) > maxBreeze) {
      breeze.vy *= 0.8;
    }
    if (animating) {
      setInterval(updateBreeze, gustTime);
    }
  }

  function animateSnow(ts) {
    let elapsed = 0;
    if (lastAnimation) {
      elapsed = ts - lastAnimation;
    } else {
      elapsed = 0;
    }
    lastAnimation = ts;
    flakes.forEach((flake) => updateFlake(flake, elapsed));
    flakes = flakes.filter((flake) => flake.y < window.innerHeight);
    if (animating) {
      requestAnimationFrame(animateSnow);
    }
    if (flakes.length == 0 && animating) {
      animating = false;
      lastAnimation = 0;
      let delay = 10000 + Math.random() * 240000;
      console.log("Running snow again in", delay / 1000, "seconds");
      setTimeout(startSnow, delay);
    }
  }

  function updateFlake(flake, elapsed) {
    if (!flake.vx) {
      flake.vx = Math.random() * 20 - 10;
    }
    if (!flake.vy) {
      flake.vy = 20 + Math.random() * 10;
    }
    if (!flake.va) {
      flake.va = Math.random() * 360 - 180;
    }
    if (!flake.vay) {
      flake.vay = Math.random() * 360 - 180;
    }
    if (!flake.yangle) {
      flake.yangle = 0;
    }
    flake.yangle += (flake.vay / 1000) * elapsed;
    flake.angle += (flake.va / 10000) * elapsed;
    flake.y += ((flake.vy + breeze.vy) / 1000) * elapsed;
    flake.x += ((flake.vx + breeze.vx) / 1000) * elapsed;
    if (flake.x > window.innerWidth) {
      flake.x = flake.x % window.innerWidth;
    }
    if (flake.x < 0) {
      flake.x = window.innerWidth;
    }
    if (flake.y > window.innerHeight) {
      flake.y = Math.random() * -200;
    }
  }

  let urls = [];

  let flakes = [];
  function makeFlakes() {
    for (let i = 1; i < 100; i++) {
      urls.push(`/snowflakes/snowflake${i}.svg`);
    }
    flakes = urls.map((u) => ({
      url: u,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight - window.innerHeight,
      angle: Math.random() * 360,
      yangle: 0,
    }));
  }
</script>

<section>
  {#each flakes as flake}
    <div
      style:color="yellow"
      style:transform={`translate(${flake.x.toFixed(0)}px,${flake.y.toFixed(
        0
      )}px)rotate(${flake.angle.toFixed(0)}deg)rotateY(${flake.yangle.toFixed(
        0
      )}deg)`}
    >
      <object data={flake.url} type="image/jpeg">
        <img alt="" src="snowflakes/snowflake1.svg" />
      </object>
    </div>
  {/each}
</section>

<style>
  section {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 99;
  }
  div {
    display: grid;
    place-content: center;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.5;
  }
</style>
