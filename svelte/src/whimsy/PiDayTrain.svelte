<script lang="ts">
  import WhimsyCanvas from "./WhimsyCanvas.svelte";
  import type { WhimsyCanvasMode, WhimsyCanvasSetup } from "./whimsyCanvas";
  // Written by "Ava & Chase" (we vibe coded the hell out of this lmao)


  export let mode: WhimsyCanvasMode = "fixed";

  const TRAIN_SPEED = 1.5;
  const CAR_COLORS = ["#7b3b3b", "#b57b3b"] as const;

  // Infinite pi digit generator — cycles through pre-computed digits
  function* piDigitGenerator(): Generator<number> {
    const PI =
      "3141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273724587006606315588174881520920962829254091715364367892590360011330530548820466521384146951941511609433057270365759591953092186117381932611793105118548074462379962749567351885752724891227938183011949129833673362440656643086021394946395224737190702179860943702770539217176293176752384674818467669405132000568127145263560827785771342757789609173637178721468440901224953430146549585371050792279689258923542019956112129021960864034418159813629774771309960518707211349999998372978049951059731732816096318595024459455346908302642522308253344685035261931188171010003137838752886587533208381420617177669147303598253490428755468731159562863882353787593751957781857780532171226806613001927876611195909216420199380935";
    let i = 0;
    while (true) {
      yield parseInt(PI[i % PI.length]);
      i++;
    }
  }

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
    ctx.fillStyle = "#b57b3b";
    // ^ this is the main engine color
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

    if (label !== undefined && label !== null) {
      ctx.fillStyle = "#ffffff";
      const fontSize = Math.max(12, Math.floor(carHeight * 0.18));
      ctx.font = `${fontSize}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(label), x + carWidth / 2, y + bodyHeight * 0.5);
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

  const setup: WhimsyCanvasSetup = (gameCanvas) => {
    let wheelAngle = 0;
    let engineX = 0; // set on first frame

    type Car = { x: number; digit: number; color: string };
    const gen = piDigitGenerator();
    let colorIndex = 0;
    const cars: Car[] = [];
    let initialized = false;

    function spawnCar(x: number): Car {
      return { x, digit: gen.next().value!, color: CAR_COLORS[colorIndex++ % 2] };
    }

    // Rail + cars (runs first each frame)
    gameCanvas.addDrawing(({ ctx, width, height, stepTime }) => {
      const elapsed = Math.min(stepTime || 16, 100);
      const speed = (elapsed / 16) * TRAIN_SPEED;

      const trainHeight = Math.min(160, height * 0.35);
      const trainWidth = Math.min(360, width * 0.8);
      const carWidth = Math.min(220, trainWidth * 0.66);
      const carHeight = trainHeight;
      const gap = 12;
      const trainY = height - trainHeight - 40;
      const wheelY = trainY + trainHeight * 0.55 + 22;
      const carWheelRadius = 18;
      const carY = wheelY - (carHeight * 0.55 + carWheelRadius);

      // First-frame init: position engine and pre-populate cars behind it
      if (!initialized) {
        initialized = true;
        engineX = width + trainWidth;
        for (let i = 0; i < 15; i++) {
          cars.push(spawnCar(engineX + trainWidth + gap + i * (carWidth + gap)));
        }
      }

      // Physics
      wheelAngle -= (elapsed / 16) * 0.12;
      engineX -= speed;
      for (const car of cars) car.x -= speed;

      // Remove cars that have fully exited the left edge
      while (cars.length > 0 && cars[0].x + carWidth < 0) {
        cars.shift();
      }

      // Always keep at least one car queued just off the right edge
      while (cars.length === 0 || cars[cars.length - 1].x < width + carWidth + gap) {
        const newX = cars.length > 0
          ? cars[cars.length - 1].x + carWidth + gap
          : width + carWidth + gap;
        cars.push(spawnCar(newX));
      }

      // Rail (no longer being used)
      /* ctx.strokeStyle = "grey";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, wheelY + 22 + 8);
      ctx.lineTo(width, wheelY + 22 + 8);
      ctx.stroke();
      */

      // Draw cars back to front
      for (let k = cars.length - 1; k >= 0; k--) {
        const { x, digit, color } = cars[k];
        if (x > width + carWidth) continue; // skip off-screen right
        drawCar(ctx, x, carY, carWidth, carHeight, wheelAngle, color, digit);
      }
    });

    // Engine drawn on top of cars (only while on screen)
    gameCanvas.addDrawing(({ ctx, width, height }) => {
      const trainHeight = Math.min(160, height * 0.35);
      const trainWidth = Math.min(360, width * 0.8);
      if (engineX + trainWidth <= 0) return;
      const trainY = height - trainHeight - 40;
      drawTrain(ctx, engineX, trainY, trainWidth, trainHeight, wheelAngle, false);
    });

    return () => {};
  };
</script>

<WhimsyCanvas mode="fixed" onLoad={setup} />
