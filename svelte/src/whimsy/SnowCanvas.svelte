<script lang="ts">
  import { Rotater3D } from "../util/draw3d";
  import { onMount, onDestroy } from "svelte";
  let walls = [];
  let flakeSize = 32;
  let animating = false;
  let lastAnimation = 0;

  let breeze = {
    vx: 4,
    vy: 5,
  };

  function findWalls() {
    walls = [];
    for (let div of document.querySelectorAll(".card")) {
      walls.push(div);
    }
  }
  function isTouchingAny(flake, divs) {
    for (let d of divs) {
      if (isTouchingTop(flake, d)) {
        return true;
      }
    }
    return false;
  }

  function isTouchingTop(flake, div: HTMLDivElement) {
    if (flake.y < 0) {
      return;
    }
    if (flake.x > div.offsetLeft) {
      if (flake.x < div.offsetLeft + div.clientWidth) {
        if (flake.y > div.offsetTop - flakeSize / 2) {
          if (flake.y < div.offsetTop + flakeSize / 2) {
            return true;
          }
        }
      }
    }
  }

  function removeBroken() {
    flakes = flakes.filter((f) => !f.broken);
  }

  onMount(() => {
    setTimeout(startSnow, 1000);
    setTimeout(removeBroken, 3000);
  });
  onDestroy(() => {
    animating = false;
  });
  let maxBreeze = 30;

  function startSnow() {
    findWalls();
    animating = true;
    makeFlakes();
    requestAnimationFrame(animateSnow);
    updateBreeze();
  }

  function updateBreeze() {
    breeze.vx += 10 - Math.random() * 20;
    breeze.vy += 5 - Math.random() * 10 + 15;
    let gustTime = Math.random() * 1000 * 30;
    if (Math.abs(breeze.vx) > maxBreeze) {
      breeze.vx *= 0.8;
    }
    if (Math.abs(breeze.vy) > maxBreeze) {
      breeze.vy *= 0.8;
    }
    console.log("New breeze:", breeze);
    if (animating) {
      setTimeout(updateBreeze, gustTime);
    }
  }

  function animateSnow(ts) {
    if (!animating) {
      return;
    }
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
    let rotater = Rotater3D(ctx);
    flakes.forEach((flake) => {
      if (flake.y < 0) {
        return;
      }
      rotater.drawAt(
        flake.x,
        flake.y,
        (flake.xangle * Math.PI) / 180,
        (flake.yangle * Math.PI) / 180,
        (flake.angle * Math.PI) / 180,
        () => {
          try {
            ctx.drawImage(
              flakeImages[flake.url],
              -flakeSize / 2,
              -flakeSize / 2,
              flakeSize,
              flakeSize
            );
            flake.broken = false;
          } catch (err) {
            flake.broken = true;
          }
        }
      );
      /*
      ctx.resetTransform();
      ctx.translate(flake.x, flake.y);
      //let scaleAmount = Math.cos((180 * flake.yangle) / Math.PI);
      //ctx.scale(scaleAmount, 1);
      ctx.rotate(flake.angle);
      try {
        ctx.drawImage(
          flakeImages[flake.url],
          -flakeSize / 2,
          -flakeSize / 2,
          flakeSize,
          flakeSize
        );
        flake.broken = false;
      } catch (err) {
        flake.broken = true;
      }
      */
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
    canvas.width = window.innerWidth;
    if (!flake.vx) {
      flake.vx = Math.random() * 20 - 10;
    }
    if (!flake.vy) {
      flake.vy = 10 - Math.random() * 20;
    }
    if (!flake.vay) {
      flake.vay = Math.random() * 18 - 36;
    }
    if (!flake.vax) {
      flake.vax = Math.random() * 18 - 36;
    }
    if (!flake.yangle) {
      flake.yangle = 0;
    }
    if (!flake.xangle) {
      flake.xangle = 0;
    }
    flake.yangle += (flake.vay / 1000) * elapsed;
    flake.xangle += (flake.vax / 1000) * elapsed;
    // Let our z rotation come from our x movement
    flake.angle += ((5 * (flake.vx + breeze.vx)) / 1000) * elapsed;
    if (isTouchingAny(flake, walls)) {
      flake.y += 0;
      flake.xangle = 0;
      flake.yangle = 0;
      if (Math.random() * 1000 < 1) {
        flake.y = Math.random() * -1000;
      }
    } else {
      flake.y += ((flake.vy + breeze.vy) / 1000) * elapsed;
    }
    flake.x += ((flake.vx + breeze.vx) / 1000) * elapsed;
    if (flake.x > canvas.width) {
      //console.log("flake off canvas, move from ", flake.x);
      flake.x = flake.x % canvas.width;
      //console.log("=>", flake.x);
    }
    while (flake.x < 0) {
      flake.x = canvas.width + flake.x;
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
      x: Math.random() * 111000,
      y: Math.random() * -10000,
      angle: Math.random() * 360,
      yangle: 0,
      xangle: 0,
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
    z-index: 999999;
  }
</style>
