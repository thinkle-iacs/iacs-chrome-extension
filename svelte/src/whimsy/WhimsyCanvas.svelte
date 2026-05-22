<script lang="ts">
  import { GameCanvas } from "simple-canvas-library";
  import { onDestroy, onMount } from "svelte";
  import {
    createStartPage,
    createWhimsyCanvas,
    installStartPageMouseTracker,
    type WhimsyCanvasMode,
    type WhimsyCanvasSetup,
    type WhimsyGameCanvas,
  } from "./whimsyCanvas";

  export let mode: WhimsyCanvasMode = "absolute";
  export let onLoad: WhimsyCanvasSetup = () => {};
  export let onUnload: () => void = () => {};
  export let useDevicePixelRatio = false;

  let canvas: HTMLCanvasElement;
  let gameCanvas: WhimsyGameCanvas | null = null;
  let cleanup: (() => void) | null = null;

  const whimsyCanvas = createWhimsyCanvas({
    mode,
    useDevicePixelRatio,
  });
  const startPage = createStartPage(whimsyCanvas);

  function syncGameCanvasSize(gameCanvas: WhimsyGameCanvas) {
    const size = whimsyCanvas.getCanvasSize();
    const resizableGameCanvas = gameCanvas as WhimsyGameCanvas & {
      setCanvasSize: (width: number, height: number) => void;
    };
    resizableGameCanvas.setCanvasSize(size.width, size.height);
  }

  function trackMouse(event: MouseEvent) {
    startPage.handleMouseMove(event, mode);
  }

  function trackKeyDown(event: KeyboardEvent) {
    startPage.handleKeyDown(event);
  }

  function trackKeyUp(event: KeyboardEvent) {
    startPage.handleKeyUp(event);
  }

  function warnAboutCanvasHandler(eventType: string) {
    console.warn(
      `WhimsyCanvas is click-through, so gameCanvas ${eventType} handlers may not run. ` +
        "Use startPage.mouse, startPage.keys, startPage.addKeyDownHandler, or startPage.addKeyUpHandler instead."
    );
  }

  function warnIfCanvasInputHandlersAreUsed(gameCanvas: WhimsyGameCanvas) {
    const canvasInputEvents = [
      "click",
      "dblclick",
      "mousedown",
      "mousemove",
      "mouseup",
      "keydown",
      "keypress",
      "keyup",
    ];
    const warnedEvents: { [eventType: string]: boolean } = {};
    const game = gameCanvas as any;
    const originalAddHandler = game.addHandler;
    const originalAddClickHandler = game.addClickHandler;

    game.addHandler = function (eventType: string, handler: Function) {
      if (canvasInputEvents.includes(eventType) && !warnedEvents[eventType]) {
        warnedEvents[eventType] = true;
        warnAboutCanvasHandler(`addHandler("${eventType}")`);
      }

      return originalAddHandler.call(this, eventType, handler);
    };

    if (originalAddClickHandler) {
      game.addClickHandler = function (handler: Function) {
        if (!warnedEvents.click) {
          warnedEvents.click = true;
          warnAboutCanvasHandler("addClickHandler");
        }

        return originalAddClickHandler.call(this, handler);
      };
    }
  }

  onMount(() => {
    installStartPageMouseTracker();
    whimsyCanvas.attach(canvas);
    startPage.useLastMousePosition(mode);
    window.addEventListener("mousemove", trackMouse);
    window.addEventListener("keydown", trackKeyDown);
    window.addEventListener("keyup", trackKeyUp);

    gameCanvas = new GameCanvas(canvas, {
      autoresize: true,
    }) as WhimsyGameCanvas;
    warnIfCanvasInputHandlersAreUsed(gameCanvas);

    gameCanvas.addDrawing(() => {
      if (gameCanvas) {
        syncGameCanvasSize(gameCanvas);
      }
    });

    const loadCleanup = onLoad(gameCanvas, startPage);
    if (typeof loadCleanup === "function") {
      cleanup = loadCleanup;
    }
    gameCanvas.run();
  });

  $: whimsyCanvas.setMode(mode);

  onDestroy(() => {
    if (cleanup) {
      cleanup();
    }
    onUnload();
    window.removeEventListener("mousemove", trackMouse);
    window.removeEventListener("keydown", trackKeyDown);
    window.removeEventListener("keyup", trackKeyUp);
    gameCanvas?.stop();
    gameCanvas = null;
    whimsyCanvas.destroy();
  });
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
