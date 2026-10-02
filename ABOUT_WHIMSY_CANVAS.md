# About WhimsyCanvas

`WhimsyCanvas` is the Svelte wrapper we use for playful canvas overlays on the start page. The goal is that a student can write ordinary `simple-canvas-library` code without learning the Svelte lifecycle, canvas sizing, cleanup, or start-page DOM bookkeeping.

The main files are:

- `svelte/src/whimsy/WhimsyCanvas.svelte`: owns the actual `<canvas>`, creates the `GameCanvas`, starts and stops it, and wires start-page input.
- `svelte/src/whimsy/whimsyCanvas.ts`: defines the start-page API, target rectangles, mouse/key state, and exported types.
- `svelte/src/whimsy/HawkCanvas.svelte` and `svelte/src/whimsy/BouncingBallCanvas.svelte`: examples of whimsy overlays.

## Basic Template

```svelte
<script lang="ts">
  import WhimsyCanvas from "./WhimsyCanvas.svelte";
  import type { WhimsyCanvasSetup } from "./whimsyCanvas";

  const setupGame: WhimsyCanvasSetup = (gameCanvas, startPage) => {
    gameCanvas.addDrawing(({ ctx, width, height }) => {
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 20, 0, Math.PI * 2);
      ctx.fill();
    });
  };
</script>

<WhimsyCanvas onLoad={setupGame} />
```

Do not call `gameCanvas.run()` or `gameCanvas.stop()` inside `setupGame`. `WhimsyCanvas` handles that. If your demo starts intervals, timeouts, listeners, or other resources, return a cleanup function:

```ts
const setupGame: WhimsyCanvasSetup = (gameCanvas, startPage) => {
  const interval = window.setInterval(() => {
    // update state
  }, 1000);

  return () => {
    window.clearInterval(interval);
  };
};
```

## WhimsyCanvas Props

```svelte
<WhimsyCanvas
  mode="absolute"
  onLoad={setupGame}
  onUnload={cleanup}
  useDevicePixelRatio={false}
/>
```

- `mode`: `"absolute"` or `"fixed"`. Absolute mode uses full-page coordinates and follows document scroll height. Fixed mode uses viewport coordinates.
- `onLoad`: called with `(gameCanvas, startPage)` after the canvas and `GameCanvas` are ready.
- `onUnload`: optional cleanup callback called when the Svelte component is destroyed.
- `useDevicePixelRatio`: forwards device-pixel-ratio behavior to the underlying whimsy layer. Most simple demos should leave this as `false`.

`WhimsyCanvas` also owns the boring details: full-size canvas styling, `pointer-events: none`, `z-index`, attaching and destroying the start-page layer, window input listeners, and stopping the game loop on destroy.

## Start Page API

The second argument to `setupGame` is `startPage`.

```ts
const setupGame: WhimsyCanvasSetup = (gameCanvas, startPage) => {
  const cards = startPage.getItems(startPage.itemTypes.CARD);
  const menuItems = startPage.getItems(startPage.itemTypes.MENU_ITEM);
  const allItems = startPage.getItems();

  const mouseX = startPage.mouse.x;
  const mouseY = startPage.mouse.y;
};
```

Available item types:

```ts
startPage.itemTypes.CARD;
startPage.itemTypes.MENU;
startPage.itemTypes.MENU_ITEM;
startPage.itemTypes.MENU_ICON;
```

Each start-page item has:

- `id`: stable ID for comparison.
- `kind`: string kind such as `"card"` or `"menu-item"`.
- `element`: the source `HTMLElement`.
- `rect`: the rectangle to use for the current canvas mode.
- `fixedRect`: viewport-based rectangle.
- `absoluteRect`: page-based rectangle.
- `dataset`: copy of the element dataset.

Use `item.rect` for normal demos. It is already adjusted for the current `mode`.

Important: `startPage.getItems()` returns fresh objects. Compare `item.id`, not object identity:

```ts
if (newTarget.id !== currentTarget.id) {
  currentTarget = newTarget;
}
```

## Coordinates And Scroll

In `"fixed"` mode, `startPage.mouse.x` and `startPage.mouse.y` use viewport coordinates from `event.clientX` and `event.clientY`.

In `"absolute"` mode, mouse coordinates include scroll offset:

```ts
x = event.clientX + window.scrollX;
y = event.clientY + window.scrollY;
```

That means absolute-mode demos can compare the mouse directly with `item.rect`, even while the page is scrolled.

When a `WhimsyCanvas` loads, the start-page mouse is initialized from the most recent global mouse, click, or mouse-down event if one exists. After that, it updates on window mouse movement.

## Input Rules

The whimsy canvas is intentionally click-through:

```css
pointer-events: none;
```

This lets users still click the start-page cards and menus underneath the canvas. Because of that, canvas-level mouse handlers from `GameCanvas`, such as `addClickHandler` or `addHandler("mousemove")`, usually will not fire on whimsy overlays. `WhimsyCanvas` warns in the console if a demo registers those handlers.

Use the start-page input instead:

```ts
const setupGame: WhimsyCanvasSetup = (gameCanvas, startPage) => {
  gameCanvas.addDrawing(() => {
    const x = startPage.mouse.x;
    const y = startPage.mouse.y;
  });

  const removeKeyDown = startPage.addKeyDownHandler((event) => {
    if (event.key === "a") {
      // handle key
      return true;
    }
  });

  return () => {
    removeKeyDown();
  };
};
```

`startPage.keys` also stores currently pressed keys by `event.key`.

## GameCanvas Basics

`GameCanvas` comes from `simple-canvas-library`.

```ts
gameCanvas.addDrawing(({ ctx, width, height, elapsed, timestamp, stepTime, remove }) => {
  // draw or update every frame
});
```

`GameCanvas` owns the animation loop. It uses `requestAnimationFrame` and clears the canvas for each frame before running the registered drawings, so a simple drawing callback can just draw:

```ts
gameCanvas.addDrawing(({ ctx }) => {
  ctx.fillRect(20, 20, 80, 40);
});
```

Common drawing params:

- `ctx`: `CanvasRenderingContext2D`.
- `width`, `height`: current canvas size.
- `elapsed`: milliseconds since this drawing was added.
- `timestamp`: current animation timestamp.
- `stepTime`: milliseconds since the previous frame.
- `remove`: removes this drawing from the game loop.

Use `stepTime` for frame-rate independent movement:

```ts
const speed = 180; // pixels per second

gameCanvas.addDrawing(({ stepTime }) => {
  const seconds = Math.min(stepTime || 16, 40) / 1000;
  x += speed * seconds;
});
```

The `Math.min(..., 40)` cap avoids huge jumps after tab sleeps, pauses, or debugger stops.

## Sprites

Sprites are also from `simple-canvas-library`. Existing code imports them like this:

```ts
import { Sprite } from "simple-canvas-library/dist/Sprite";
```

Typical setup:

```ts
const hawk = new Sprite({
  src: "/hawk-sprite.png",
  x: 100,
  y: 100,
  frameWidth: 64,
  frameHeight: 64,
  targetWidth: 64,
  targetHeight: 64,
  frameSequence: [0, 1, 2, 3],
  frameRate: 8,
  repeat: true,
  flipHorizontal: false,
});

gameCanvas.addDrawing(hawk);
```

Sprite notes:

- `frameWidth` and `frameHeight` are the size of one source frame in the sprite sheet.
- `targetWidth` and `targetHeight` are the rendered size on the canvas.
- `frameSequence` controls which frames play and in what order.
- `repeat: true` loops the sequence.
- `repeat: false` plays through and then holds on the final frame.
- `flipHorizontal` flips the sprite around its center.

When switching animation sequences, reset the sprite animation index if the new sequence should start at its first frame:

```ts
if (hawk.frameSequence !== LAND) {
  hawk.frameSequence = LAND;
  hawk.frameAnimationIndex = 0;
  hawk.repeat = false;
}
```

For one-shot animations such as landing or taking off, use `repeat = false` and avoid overwriting `frameSequence` with a flight sequence until the one-shot has finished.

## Common Pitfalls

- Do not call `gameCanvas.run()` in a whimsy demo. The wrapper starts the loop.
- Do not call `gameCanvas.stop()` for normal cleanup. The wrapper stops it on destroy.
- Do not use `gameCanvas.addClickHandler` or `addHandler("mousemove")` for click-through whimsy overlays. Use `startPage.mouse` and key handlers.
- Do not compare start-page items by object identity. Use `item.id`.
- Do not use `fixedRect` or `absoluteRect` unless you are intentionally managing coordinate systems yourself. Use `item.rect`.
- Do not move objects by a fixed number of pixels per frame. Use `stepTime`.
- When changing sprite sequences, reset `frameAnimationIndex` when you need the new animation to start from frame zero.
- When using one-shot sprite animations, set `repeat = false` and avoid reassigning the same one-shot sequence every frame.

## Whimsy Setting

`WhimsyCanvas` does not automatically check the global whimsy store. It is just the canvas wrapper. The caller decides whether to render it:

```svelte
{#if $whimsy}
  <HawkCanvas />
{/if}
```

Secret routes, debug routes, or easter eggs can intentionally bypass that store if they want the overlay to appear regardless of the normal setting.
