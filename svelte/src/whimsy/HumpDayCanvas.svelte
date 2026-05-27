<script lang="ts">
  import WhimsyCanvas from "./WhimsyCanvas.svelte";
  import type { WhimsyCanvasSetup, StartPage } from "./whimsyCanvas";
  import { triggerCamel } from "../prefs";

  let isActive = false;
  let camelX = 0;
  let camelY = 0;
  let textOpacity = 1;

  const setupGame: WhimsyCanvasSetup = (gameCanvas, startPage) => {
    let mouseX = 0;
    let mouseY = 0;
    let camelVelX = 0;
    let camelVelY = 0;
    const CAMEL_SIZE = 60;
    const ACCELERATION = 0.2;
    const FRICTION = 0.85;
    const MAX_SPEED = 5;
    let textTimer = 0;
    const TEXT_DURATION = 1000; // 1 second

    // Listen to mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    gameCanvas.addDrawing(({ ctx, width, height, stepTime }) => {
      const frameTime = (stepTime || 16) / 1000;

      // Calculate direction to mouse
      const dx = mouseX - camelX;
      const dy = mouseY - camelY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > CAMEL_SIZE / 2) {
        // Accelerate towards mouse
        const angle = Math.atan2(dy, dx);
        camelVelX += Math.cos(angle) * ACCELERATION;
        camelVelY += Math.sin(angle) * ACCELERATION;
      }

      // Apply friction
      camelVelX *= FRICTION;
      camelVelY *= FRICTION;

      // Limit speed
      const speed = Math.sqrt(camelVelX * camelVelX + camelVelY * camelVelY);
      if (speed > MAX_SPEED) {
        camelVelX = (camelVelX / speed) * MAX_SPEED;
        camelVelY = (camelVelY / speed) * MAX_SPEED;
      }

      // Update position
      camelX += camelVelX;
      camelY += camelVelY;

      // Keep camel on screen
      camelX = Math.max(CAMEL_SIZE / 2, Math.min(width - CAMEL_SIZE / 2, camelX));
      camelY = Math.max(CAMEL_SIZE / 2, Math.min(height - CAMEL_SIZE / 2, camelY));

      // Draw camel
      ctx.font = `${CAMEL_SIZE}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Add rotation based on velocity direction
      const angle = Math.atan2(camelVelY, camelVelX);
      ctx.save();
      ctx.translate(camelX, camelY);
      ctx.rotate(angle);
      ctx.fillText("🐪", 0, 0);
      ctx.restore();

      // Draw text with fade out
      if (textTimer > 0) {
        textOpacity = Math.max(0, (TEXT_DURATION - textTimer) / TEXT_DURATION);
        ctx.globalAlpha = textOpacity;
        ctx.font = "48px sans-serif";
        ctx.fillStyle = "rgba(255, 100, 0, 1)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Happy Hump Day!", width / 2, height / 3);
        ctx.globalAlpha = 1;
        textTimer -= stepTime || 16;
      }
    });

    // Subscribe to trigger
    const unsubscribe = triggerCamel.subscribe((value) => {
      if (value) {
        isActive = true;
        // Reset camel position to center
        camelX = window.innerWidth / 2;
        camelY = window.innerHeight / 2;
        camelVelX = 0;
        camelVelY = 0;
        textTimer = TEXT_DURATION;
        triggerCamel.set(false);
      }
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      unsubscribe();
    };
  };
</script>

<WhimsyCanvas mode="fixed" {setupGame} />

<style>
</style>
