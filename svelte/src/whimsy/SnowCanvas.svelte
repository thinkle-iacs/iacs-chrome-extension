<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  let flakeSize = 64;
  let animating = false;
  let lastAnimation = 0;
  let breeze = {
    vx: 4,
    vy: 0,
  };

  onMount(() => {
    setTimeout(startSnow, 1000);
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
    breeze.vx += 10 - (Math.random() * 20) / 2;
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
    //flakes = flakes.filter((flake) => flake.y < window.innerHeight);
    if (animating) {
      requestAnimationFrame(animateSnow);
    }
    let ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = document.querySelector("main").clientHeight;
    canvas.style.width = `${canvas.width}px`;
    canvas.style.height = `${canvas.height}px`;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    flakes.forEach((flake) => {
      ctx.resetTransform();
      ctx.translate(flake.x, flake.y);
      ctx.rotate(flake.angle);
      try {
        ctx.drawImage(
          flakeImages[flake.url],
          -flakeSize / 2,
          -flakeSize / 2,
          flakeSize,
          flakeSize
        );
      } catch (err) {
        flake.broken = true;
      }
    });

    /*if (flakes.length == 0 && animating) {
      animating = false;
      lastAnimation = 0;
      let delay = 10000 + Math.random() * 240000;
      console.log("Running snow again in", delay / 1000, "seconds");
      setTimeout(startSnow, delay);
    }
    */
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
    if (flake.x > canvas.width) {
      flake.x = flake.x % canvas.width;
    }
    if (flake.x < 0) {
      flake.x = canvas.width;
    }
    if (flake.y > canvas.height) {
      flake.y = -500 * Math.random();
    }
  }

  let urls = [];
  let flakeImages = {};
  let flakes = [];
  function makeFlakes() {
    for (let i = 1; i < 100; i++) {
      urls.push(`/snowflakes/snowflake${i}.svg`);
    }
    flakes = urls.map((u) => ({
      url: u,
      x: Math.random() * 4000,
      y: Math.random() * 3000,
      angle: Math.random() * 360,
      yangle: 0,
    }));
    urls = urls;
  }
  let canvas: HTMLCanvasElement;
</script>

<canvas bind:this={canvas} />
<section>
  <!-- snowflake assets-->
  {#each urls as url}
    <img alt="" src={url} bind:this={flakeImages[url]} />
  {/each}
</section>

<style>
  section {
    display: none;
  }
  canvas {
    width: 100%;
    height: 100%;
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
