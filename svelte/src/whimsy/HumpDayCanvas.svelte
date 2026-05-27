<script lang="ts">
  import WhimsyCanvas from "./WhimsyCanvas.svelte";
  import type { WhimsyCanvasSetup } from "./whimsyCanvas";

  const setupGame: WhimsyCanvasSetup = (gameCanvas, startPage) => {
    // TODO: Add your camel sprite GameCanvas code here
    
    gameCanvas.addDrawing(({ ctx, width, height, stepTime }) => {
      // Write your drawing code here
      // Example: Draw a simple camel
      ctx.fillStyle = "#D4A574";
      ctx.font = "80px serif";
      ctx.textAlign = "center";
      ctx.fillText("🐪", width / 2, height / 2);
    });

    // Return cleanup function if needed
    return () => {
      // Cleanup code here
    };
  };
</script>

<WhimsyCanvas {setupGame} />

<style>
</style>
