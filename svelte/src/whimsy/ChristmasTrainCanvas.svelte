<script lang="ts">
  import WhimsyCanvas from "./WhimsyCanvas.svelte";
  import type { WhimsyCanvasMode, WhimsyCanvasSetup } from "./whimsyCanvas";
  // Written by "Ava & Chase" (we vibe coded the hell out of this lmao)

  export let mode: WhimsyCanvasMode = "absolute";

  function drawTrain(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    trainWidth: number,
    trainHeight: number,
    wheelAngle: number,
    mirror = false
  ) {
    ctx.save();
    if (mirror) {
      ctx.translate(x + trainWidth, 0);
      ctx.scale(-1, 1);
      x = 0;
    }

    const bodyHeight = trainHeight * 0.55;
    const stackWidth = trainWidth * 0.12;
    const stackHeight = trainHeight * 0.35;
    const cabWidth = trainWidth * 0.28;
    const cabHeight = bodyHeight * 0.82;
    const wheelRadius = 22;
    const wheelXSpacing = trainWidth * 0.22;
    const wheelY = y + bodyHeight + wheelRadius;

    // Train body
    ctx.fillStyle = "#b41f26";
    ctx.fillRect(x + 12, y + bodyHeight * 0.12, trainWidth * 0.64, bodyHeight * 0.88);
    ctx.fillStyle = "#f8c548";
    ctx.fillRect(x + trainWidth * 0.04, y + bodyHeight * 0.22, trainWidth * 0.28, bodyHeight * 0.56);
    ctx.fillStyle = "#bf3b3b";
    ctx.fillRect(x + trainWidth * 0.72, y + bodyHeight * 0.08, trainWidth * 0.24, bodyHeight * 0.70);

    // Cab roof
    ctx.fillStyle = "#0d2b40";
    ctx.fillRect(x + trainWidth * 0.72, y - 8, cabWidth, 18);
    ctx.fillStyle = "#2f4f62";
    ctx.fillRect(x + trainWidth * 0.72, y + 2, cabWidth, cabHeight);

    // Smoke stack
    ctx.fillStyle = "#263a4d";
    ctx.fillRect(x + trainWidth * 0.1, y - stackHeight, stackWidth, stackHeight);
    ctx.fillStyle = "#5e7488";
    ctx.fillRect(
      x + trainWidth * 0.1 - stackWidth * 0.075,
      y - stackHeight - 8,
      stackWidth * 1.15,
      8
    );

    // Window
    ctx.fillStyle = "#a9e5ff";
    ctx.fillRect(x + trainWidth * 0.78, y + bodyHeight * 0.3, cabWidth * 0.38, cabHeight * 0.38);
    ctx.strokeStyle = "#4c6f84";
    ctx.lineWidth = 3;
    ctx.strokeRect(x + trainWidth * 0.78, y + bodyHeight * 0.3, cabWidth * 0.38, cabHeight * 0.38);

    // Engine details
    ctx.fillStyle = "#d4a359";
    ctx.fillRect(x + trainWidth * 0.14, y + bodyHeight * 0.52, trainWidth * 0.16, bodyHeight * 0.18);
    ctx.fillRect(x + trainWidth * 0.42, y + bodyHeight * 0.60, trainWidth * 0.14, bodyHeight * 0.14);

    // Wheels
    const wheelCenters = [x + wheelXSpacing, x + wheelXSpacing * 2.4, x + wheelXSpacing * 3.8];
    ctx.strokeStyle = "#1f2f39";
    ctx.lineWidth = 4;
    wheelCenters.forEach((centerX) => {
      // Wheel outer rim
      ctx.beginPath();
      ctx.arc(centerX, wheelY, wheelRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#1f3140";
      ctx.fill();
      ctx.stroke();

      // Wheel hub
      ctx.beginPath();
      ctx.arc(centerX, wheelY, wheelRadius * 0.62, 0, Math.PI * 2);
      ctx.fillStyle = "#7b9fb9";
      ctx.fill();

      // Rotating spokes
      const spokeCount = 6;
      for (let spoke = 0; spoke < spokeCount; spoke += 1) {
        const angle = wheelAngle + (Math.PI * 2 * spoke) / spokeCount;
        const spokeX = centerX + Math.cos(angle) * (wheelRadius * 0.55);
        const spokeY = wheelY + Math.sin(angle) * (wheelRadius * 0.55);
        ctx.beginPath();
        ctx.moveTo(centerX, wheelY);
        ctx.lineTo(spokeX, spokeY);
        ctx.stroke();
      }
    });

    // Axle rod connecting wheels
    ctx.strokeStyle = "#d3b972";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(wheelCenters[0], wheelY);
    ctx.lineTo(wheelCenters[2], wheelY);
    ctx.stroke();
    ctx.restore();
  }

  const setup: WhimsyCanvasSetup = (gameCanvas, startPage) => {
    let wheelAngle = 0;
    let trainOffset = 0;
    let trainDirection = -1;
    const trainSpeed = -1.5; // movement speed in px per frame unit

    gameCanvas.addDrawing(({ ctx, width, height, stepTime }) => {
      const elapsed = Math.min(stepTime || 16, 100);
      wheelAngle -= (elapsed / 16) * 0.12 * trainDirection;
      trainOffset += (elapsed / 16) * trainSpeed * trainDirection;

      const trainHeight = Math.min(160, height * 0.35);
      const trainWidth = Math.min(360, width * 0.8);
      const minTrainX = -trainWidth;
      const maxTrainX = width;

      if (trainDirection < 0 && trainOffset > maxTrainX) {
        trainOffset = maxTrainX;
        trainDirection = 1;
      } else if (trainDirection > 0 && trainOffset < minTrainX) {
        trainOffset = minTrainX;
        trainDirection = -1;
      }

      const trainY = height - trainHeight - 40;
      const wheelY = trainY + trainHeight * 0.55 + 22;

      ctx.strokeStyle = "grey";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, wheelY + 22 + 8);
      ctx.lineTo(width, wheelY + 22 + 8);
      ctx.stroke();

      // Draw the train
      const mirrored = trainDirection < 0;
      drawTrain(
        ctx,
        trainOffset,
        trainY,
        trainWidth,
        trainHeight,
        mirrored ? -wheelAngle : wheelAngle,
        mirrored
      );
    });

    return () => {
      // No cleanup needed.
    };
  };
</script>

<WhimsyCanvas {mode} onLoad={setup} />