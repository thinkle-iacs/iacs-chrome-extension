<script lang="ts">
  import WhimsyCanvas from "./WhimsyCanvas.svelte";
  import type { WhimsyCanvasMode, WhimsyCanvasSetup } from "./whimsyCanvas";
  // Written by "Ava & Chase" (we vibe coded the hell out of this lmao)

  export let mode: WhimsyCanvasMode = "fixed";

  // First 100 digits of pi (including the leading 3), digits-only, comma-separated
  const piDigits: number[] = [
    3,1,4,1,5,9,2,6,5,3,5,8,9,7,9,3,2,3,8,4,6,2,6,4,3,3,8,3,2,7,9,5,0,2,8,8,4,1,9,7,1,6,9,3,9,9,3,7,5,1,0,5,8,2,0,9,7,4,9,4,4,5,9,2,3,0,7,8,1,6,4,0,6,2,8,6,2,0,8,9,9,8,6,2,8,0,3,4,8,2,5,3,4,2,1,1,7,0,6,7
  ];

  // Fixed train cars array with stable positions and colors
  // Digits are assigned dynamically based on currentDigitIndex
  const cars = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    color: i % 2 === 0 ? "#7b3b3b" : "#b57b3b"
  }));

  // Track which pi digit is displayed on the first car
  // When the first car exits the screen, this increments
  let currentDigitIndex = 0;

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
    ctx.fillStyle = "green";
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

  function drawCar(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    carWidth: number,
    carHeight: number,
    wheelAngle: number,
    color = "#8b3b3b",
    label?: string | number
  ) {
    ctx.save();
    const bodyHeight = carHeight * 0.55;
    const wheelRadius = 18;
    const wheelXSpacing = carWidth * 0.26;
    const wheelY = y + bodyHeight + wheelRadius;

    // Car body
    ctx.fillStyle = color;
    ctx.fillRect(x + 8, y + bodyHeight * 0.12, carWidth - 16, bodyHeight * 0.88);

    // Little roof/detail
    ctx.fillStyle = "#2f4f62";
    ctx.fillRect(x + carWidth * 0.06, y - 6, carWidth * 0.4, 12);

    // Draw label (digit) centered on the car body
    if (label !== undefined && label !== null) {
      ctx.fillStyle = "#ffffff";
      const fontSize = Math.max(12, Math.floor(carHeight * 0.18));
      ctx.font = `${fontSize}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const textX = x + carWidth / 2;
      const textY = y + bodyHeight * 0.5;
      ctx.fillText(String(label), textX, textY);
    }

    // Wheels
    const wheelCenters = [x + wheelXSpacing, x + wheelXSpacing * 2.6];
    ctx.strokeStyle = "#1f2f39";
    ctx.lineWidth = 3;
    wheelCenters.forEach((centerX) => {
      ctx.beginPath();
      ctx.arc(centerX, wheelY, wheelRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#1f3140";
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, wheelY, wheelRadius * 0.62, 0, Math.PI * 2);
      ctx.fillStyle = "#7b9fb9";
      ctx.fill();

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

    // Axle rod
    ctx.strokeStyle = "#d3b972";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(wheelCenters[0], wheelY);
    ctx.lineTo(wheelCenters[1], wheelY);
    ctx.stroke();
    ctx.restore();
  }

  const setup: WhimsyCanvasSetup = (gameCanvas, startPage) => {
    let wheelAngle = 0;
    let trainOffset = 1500;
    const trainDirection = 1;
    const trainSpeed = 1.5; // movement speed in px per frame unit

    gameCanvas.addDrawing(({ ctx, width, height, stepTime }) => {
      const elapsed = Math.min(stepTime || 16, 100);
      wheelAngle -= (elapsed / 16) * 0.12 * trainDirection;
      trainOffset -= (elapsed / 16) * trainSpeed * trainDirection;

      const trainHeight = Math.min(160, height * 0.35);
      const trainWidth = Math.min(360, width * 0.8);
      const minTrainX = -trainWidth;
      const maxTrainX = width;

      // Loop the train across the screen without turning it around
      if (trainOffset > maxTrainX) {
        trainOffset = minTrainX;
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
      // Draw cars from farthest to nearest using their array index for spacing
      const carWidth = Math.min(220, trainWidth * 0.66);
      const carHeight = trainHeight; // make the wheels touch the same ground.
      const gap = 12;
      const carWheelRadius = 18;

      // Check if the first car has exited the screen
      const firstCarX = trainOffset + 1 * (carWidth + gap) * trainDirection + 140;
      if (firstCarX + carWidth < -50 || firstCarX > width + 50) {
        currentDigitIndex += 1;
        console.log(`[First Car Exit] Incremented currentDigitIndex to ${currentDigitIndex}, wraps around at piDigits.length=${piDigits.length}`);
      }

      for (let k = cars.length - 1; k >= 0; k--) {
        const car = cars[k];
        const posIndex = k + 1;
        const carX = trainOffset + posIndex * (carWidth + gap) * trainDirection + 140;
        const carY = wheelY - (carHeight * 0.55 + carWheelRadius);
        // Assign digit based on currentDigitIndex and car position
        const digitIndex = (currentDigitIndex + k) % piDigits.length;
        const digit = piDigits[digitIndex];
        drawCar(ctx, carX, carY, carWidth, carHeight, wheelAngle, car.color, digit);
      }

      // Draw the engine on top of the cars
      drawTrain(ctx, trainOffset, trainY, trainWidth, trainHeight, wheelAngle, false);
    });

    return () => {
      // No cleanup needed.
    };
  };
</script>

<WhimsyCanvas mode="fixed" onLoad={setup} />