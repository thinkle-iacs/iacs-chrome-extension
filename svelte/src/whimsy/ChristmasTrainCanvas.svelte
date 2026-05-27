<script lang="ts">
  import WhimsyCanvas from "./WhimsyCanvas.svelte";
  import type { WhimsyCanvasMode, WhimsyCanvasSetup } from "./whimsyCanvas";

  export let mode: WhimsyCanvasMode = "absolute";

  const setup: WhimsyCanvasSetup = (gameCanvas, startPage) => {
    // Add your Christmas train game code here.
    // Use gameCanvas.addDrawing(...) to animate the train,
    // and use startPage.getItems(...), startPage.mouse, or
    // startPage.addKeyDownHandler(...) for interactions.

    gameCanvas.addDrawing(({ ctx, width, height }) => {
      // Placeholder rendering so the route is visible.
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "#ffffff";
      ctx.font = "20px sans-serif";
      ctx.fillText("Christmas Train placeholder", 24, 48);
    });

    return () => {
      // Add any cleanup logic here if you create timers or event handlers.
    };
  };
</script>

<WhimsyCanvas {mode} onLoad={setup} />
