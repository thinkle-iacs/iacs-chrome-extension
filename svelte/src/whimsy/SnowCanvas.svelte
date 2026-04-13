<script lang="ts">
  import { Rotater3D } from "../util/draw3d";
  import { onDestroy, onMount } from "svelte";
  import {
    createWhimsyCanvas,
    type WhimsyFrame,
    type WhimsyTarget,
  } from "./whimsyCanvas";

  type Flake = {
    angle: number;
    broken?: boolean;
    url: string;
    vax?: number;
    vay?: number;
    vx?: number;
    vy?: number;
    x: number;
    xangle: number;
    y: number;
    yangle: number;
  };

  const urls = Array.from(
    {
      length: 99,
    },
    (_, index) => `/snowflakes/snowflake${index + 1}.svg`
  );

  const snowLayer = createWhimsyCanvas({
    mode: "absolute",
    maxFps: 30,
  });

  let flakeSize = 32;
  let animating = false;
  let lastAnimation = 0;
  let startTimer = 0;
  let idleStartHandle: number | null = null;
  let brokenCleanupTimer = 0;
  let breezeTimer = 0;

  let breeze = {
    vx: 4,
    vy: 5,
  };

  function isTouchingAny(flake: Flake, targets: WhimsyTarget[]) {
    for (let target of targets) {
      if (isTouchingTop(flake, target)) {
        return true;
      }
    }
    return false;
  }

  function isTouchingTop(flake: Flake, target: WhimsyTarget) {
    const rect = target.rect;
    if (flake.y < 0) {
      return false;
    }
    if (flake.x > rect.left) {
      if (flake.x < rect.right) {
        if (flake.y > rect.top - flakeSize / 2) {
          if (flake.y < rect.top + flakeSize / 2) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function removeBroken() {
    flakes = flakes.filter((f) => !f.broken);
  }

  function preloadFlakeImages() {
    urls.forEach((url) => {
      if (flakeImages[url]) {
        return;
      }
      const image = new Image();
      image.src = url;
      flakeImages[url] = image;
    });
  }

  function canDrawImage(image?: HTMLImageElement) {
    return !!image && image.complete && image.naturalWidth > 0;
  }

  function scheduleStartSnow() {
    const begin = () => {
      idleStartHandle = null;
      startTimer = 0;
      startSnow();
    };

    if ("requestIdleCallback" in window) {
      idleStartHandle = window.requestIdleCallback(begin, {
        timeout: 2000,
      });
      return;
    }

    startTimer = window.setTimeout(begin, 1800);
  }

  onMount(() => {
    snowLayer.attach(canvas);
    preloadFlakeImages();
    scheduleStartSnow();
    brokenCleanupTimer = window.setTimeout(removeBroken, 3000);
  });

  onDestroy(() => {
    animating = false;
    if (startTimer) {
      window.clearTimeout(startTimer);
    }
    if (brokenCleanupTimer) {
      window.clearTimeout(brokenCleanupTimer);
    }
    if (breezeTimer) {
      window.clearTimeout(breezeTimer);
    }
    if (idleStartHandle != null && "cancelIdleCallback" in window) {
      window.cancelIdleCallback(idleStartHandle);
    }
    snowLayer.destroy();
  });

  let maxBreeze = 30;

  function startSnow() {
    if (animating) {
      return;
    }
    animating = true;
    const { width } = snowLayer.getCanvasSize();
    makeFlakes(width);
    snowLayer.start(animateSnow);
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
    if (animating) {
      breezeTimer = window.setTimeout(updateBreeze, gustTime);
    }
  }

  function animateSnow({
    clear,
    ctx,
    elapsed,
    getTargets,
    height,
    now,
    width,
  }: WhimsyFrame) {
    if (!animating) {
      return;
    }
    if (lastAnimation) {
      elapsed = now - lastAnimation;
    }
    lastAnimation = now;

    const restingTargets = [...getTargets("card"), ...getTargets("menu-icon")];
    flakes.forEach((flake) =>
      updateFlake(flake, elapsed, width, height, restingTargets)
    );

    clear();
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
          const image = flakeImages[flake.url];
          if (!canDrawImage(image)) {
            flake.broken = false;
            return;
          }
          try {
            ctx.drawImage(
              image,
              -flakeSize / 2,
              -flakeSize / 2,
              flakeSize,
              flakeSize
            );
            flake.broken = false;
          } catch (error) {
            flake.broken = true;
          }
        }
      );
    });
  }

  function updateFlake(
    flake: Flake,
    elapsed: number,
    width: number,
    height: number,
    restingTargets: WhimsyTarget[]
  ) {
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
    flake.angle += ((5 * (flake.vx + breeze.vx)) / 1000) * elapsed;
    if (isTouchingAny(flake, restingTargets)) {
      flake.xangle = 0;
      flake.yangle = 0;
      if (Math.random() * 1000 < 1) {
        flake.y = Math.random() * -1000;
      }
    } else {
      flake.y += ((flake.vy + breeze.vy) / 1000) * elapsed;
    }
    flake.x += ((flake.vx + breeze.vx) / 1000) * elapsed;
    if (flake.x > width) {
      flake.x = flake.x % width;
    }
    while (flake.x < 0) {
      flake.x = width + flake.x;
    }
    if (flake.y > height) {
      flake.y = -500 * Math.random();
    }
  }

  let flakeImages: Record<string, HTMLImageElement> = {};
  let flakes: Flake[] = [];

  function makeFlakes(width: number) {
    flakes = urls.map((u) => ({
      url: u,
      x: Math.random() * width,
      y: Math.random() * -10000,
      angle: Math.random() * 360,
      yangle: 0,
      xangle: 0,
    }));
  }

  let canvas: HTMLCanvasElement;
</script>

<canvas bind:this={canvas} />

<style>
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
