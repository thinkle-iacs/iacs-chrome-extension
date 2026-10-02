<script lang="ts">
  import { Rotater3D } from "../util/draw3d";
  import WhimsyCanvas from "./WhimsyCanvas.svelte";
  import type { WhimsyCanvasSetup, WhimsyTarget } from "./whimsyCanvas";

  type Flake = {
    angle: number;
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

  const FLAKE_COUNT = 40;

  const urls = Array.from(
    { length: FLAKE_COUNT },
    (_, index) => `/snowflakes/snowflake${index + 1}.svg`
  );

  let flakeSize = 32;
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
    if (flake.y < 0) return false;
    return (
      flake.x > rect.left &&
      flake.x < rect.right &&
      flake.y > rect.top - flakeSize / 2 &&
      flake.y < rect.top + flakeSize / 2
    );
  }

  // Pre-rasterize SVG images to plain canvases so drawImage is fast every frame.
  let flakeBitmaps: Record<string, HTMLCanvasElement> = {};

  function prerasterizeReady(images: Record<string, HTMLImageElement>) {
    for (const url of urls) {
      if (flakeBitmaps[url]) continue;
      const img = images[url];
      if (!img || !img.complete || img.naturalWidth === 0) continue;
      const oc = document.createElement("canvas");
      oc.width = flakeSize;
      oc.height = flakeSize;
      oc.getContext("2d")!.drawImage(img, 0, 0, flakeSize, flakeSize);
      flakeBitmaps[url] = oc;
    }
  }

  function preloadFlakeImages() {
    const images: Record<string, HTMLImageElement> = {};
    urls.forEach((url) => {
      const image = new Image();
      image.src = url;
      images[url] = image;
    });
    return images;
  }

  let maxBreeze = 30;

  function updateBreeze() {
    breeze.vx += 10 - Math.random() * 20;
    breeze.vy += 5 - Math.random() * 10 + 15;
    const gustTime = Math.random() * 30000;
    if (Math.abs(breeze.vx) > maxBreeze) breeze.vx *= 0.8;
    if (Math.abs(breeze.vy) > maxBreeze) breeze.vy *= 0.8;
    breezeTimer = window.setTimeout(updateBreeze, gustTime);
  }

  function updateFlake(
    flake: Flake,
    elapsed: number,
    width: number,
    height: number,
    restingTargets: WhimsyTarget[]
  ) {
    if (!flake.vx) flake.vx = Math.random() * 20 - 10;
    if (!flake.vy) flake.vy = 10 - Math.random() * 20;
    if (!flake.vay) flake.vay = Math.random() * 18 - 36;
    if (!flake.vax) flake.vax = Math.random() * 18 - 36;
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
    if (flake.x > width) flake.x = flake.x % width;
    while (flake.x < 0) flake.x = width + flake.x;
    if (flake.y > height) flake.y = -500 * Math.random();
  }

  function makeFlakes(width: number) {
    return urls.map((u) => ({
      url: u,
      x: Math.random() * width,
      y: Math.random() * -10000,
      angle: Math.random() * 360,
      yangle: 0,
      xangle: 0,
    }));
  }

  const setup: WhimsyCanvasSetup = (gameCanvas, startPage) => {
    const flakeImages = preloadFlakeImages();
    let flakes: Flake[] = [];
    updateBreeze();

    gameCanvas.addDrawing(({ ctx, width, height, stepTime }) => {
      if (flakes.length === 0) flakes = makeFlakes(width);

      // Lazily rasterize SVGs → plain canvas bitmaps; fast drawImage every frame after
      prerasterizeReady(flakeImages);

      const elapsed = Math.min(stepTime || 16, 100);
      const restingTargets = [
        ...startPage.getItems("card"),
        ...startPage.getItems("menu-icon"),
      ];
      flakes.forEach((flake) =>
        updateFlake(flake, elapsed, width, height, restingTargets)
      );

      // GameCanvas already clears before each drawing; no clear() call needed.
      const rotater = Rotater3D(ctx);
      flakes.forEach((flake) => {
        if (flake.y < 0) return;
        const bitmap = flakeBitmaps[flake.url];
        if (!bitmap) return;
        rotater.drawAt(
          flake.x,
          flake.y,
          (flake.xangle * Math.PI) / 180,
          (flake.yangle * Math.PI) / 180,
          (flake.angle * Math.PI) / 180,
          () => {
            ctx.drawImage(bitmap, -flakeSize / 2, -flakeSize / 2, flakeSize, flakeSize);
          }
        );
      });
    });

    return () => {
      if (breezeTimer) window.clearTimeout(breezeTimer);
    };
  };
</script>

<WhimsyCanvas mode="absolute" onLoad={setup} />
