<script lang="ts">
  import WhimsyCanvas from "./WhimsyCanvas.svelte";
  import type { WhimsyCanvasSetup, StartPage } from "./whimsyCanvas";
  import { triggerCamel } from "../prefs";

  let camelX = 0;
  let camelY = 0;
  let textOpacity = 1;
  let camelVisible = false;

  // For debugging: expose on window so you can inspect in browser console
  // (temporary - can be removed after verification)
  // @ts-ignore
  window.__hump_debug = { camelVisible: () => camelVisible };

  const setupGame: WhimsyCanvasSetup = (gameCanvas, startPage) => {
    let mouseX = 0;
    let mouseY = 0;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let camelVelX = 0;
    let camelVelY = 0;
    const CAMEL_SIZE = 60;
    const ACCELERATION = 0.2;
    const FRICTION = 0.85;
    const MAX_SPEED = 5;
    let textTimer = 0;
    const TEXT_DURATION = 1000; // 1 second

    // Initialize camel position later once the canvas is sized
    camelX = 0;
    camelY = 0;

    // Listen to mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    gameCanvas.addDrawing(({ ctx, width, height, stepTime }) => {
      canvasWidth = width;
      canvasHeight = height;

      if (!camelVisible) {
        return;
      }

      if (!camelX || !camelY) {
        camelX = width / 2;
        camelY = height / 2;
      }

      if (!mouseX || !mouseY) {
        mouseX = width / 2;
        mouseY = height / 2;
      }

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

      // Clear canvas fully (avoids accidental over-bright fade hiding the camel)
      ctx.clearRect(0, 0, width, height);

      // Draw camel
      const angle = Math.atan2(camelVelY, camelVelX);

      ctx.save();
      ctx.translate(camelX, camelY);
      ctx.rotate(angle);
      ctx.scale(1.5, 1.5);

      // Camel body (brighter colors + thicker stroke for visibility)
      ctx.fillStyle = "#ff9f3b";
      ctx.strokeStyle = "#6b3f13";
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.ellipse(0, 0, 20, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Humps
      ctx.beginPath();
      ctx.arc(-8, -10, 8, Math.PI, 0);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(8, -10, 8, Math.PI, 0);
      ctx.fill();
      ctx.stroke();

      // Neck
      ctx.fillRect(16, -18, 6, 20);
      ctx.strokeRect(16, -18, 6, 20);

      // Head
      ctx.beginPath();
      ctx.ellipse(24, -20, 8, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Legs
      ctx.fillRect(-14, 10, 4, 18);
      ctx.strokeRect(-14, 10, 4, 18);
      ctx.fillRect(-4, 10, 4, 18);
      ctx.strokeRect(-4, 10, 4, 18);
      ctx.fillRect(6, 10, 4, 18);
      ctx.strokeRect(6, 10, 4, 18);
      ctx.fillRect(16, 10, 4, 18);
      ctx.strokeRect(16, 10, 4, 18);

      // Tail
      ctx.beginPath();
      ctx.moveTo(-20, -2);
      ctx.lineTo(-28, 6);
      ctx.stroke();

      // Debug: draw a small bounding circle to make the camel easier to spot
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,0,0,0.6)";
      ctx.lineWidth = 1;
      ctx.arc(0, 0, 28, 0, Math.PI * 2);
      ctx.stroke();

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

    let camelHideTimeout: ReturnType<typeof setTimeout> | null = null;
    const CAMEL_VISIBLE_DURATION = 3000;

    // Subscribe to trigger
    const unsubscribe = triggerCamel.subscribe((value) => {
      camelVisible = value;
      console.log("HumpDayCanvas: triggerCamel ->", value);
      // also expose last known camels for quick inspection
      // @ts-ignore
      window.__hump_debug.last = { camelVisible, canvasWidth, canvasHeight, camelX, camelY };
      if (value) {
        // Reset camel position to center of the canvas
        camelX = canvasWidth ? canvasWidth / 2 : window.innerWidth / 2;
        camelY = canvasHeight ? canvasHeight / 2 : window.innerHeight / 2;
        mouseX = camelX;
        mouseY = camelY;
        camelVelX = 0;
        camelVelY = 0;
        textTimer = TEXT_DURATION;
        if (camelHideTimeout) {
          clearTimeout(camelHideTimeout);
        }
        camelHideTimeout = setTimeout(() => {
          triggerCamel.set(false);
          camelHideTimeout = null;
        }, CAMEL_VISIBLE_DURATION);
      }
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      unsubscribe();
    };
  };
</script>

<WhimsyCanvas mode="fixed" onLoad={setupGame} />

<style>
</style>
