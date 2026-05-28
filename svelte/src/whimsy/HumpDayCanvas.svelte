<script lang="ts">
  import WhimsyCanvas from "./WhimsyCanvas.svelte";
  import type {
    WhimsyCanvasSetup,
    StartPage,
    StartPageItem,
  } from "./whimsyCanvas";
  import { triggerCamel } from "../prefs";

  let camelX = 0;
  let camelY = 0;
  let textOpacity = 1;
  let camelVisible = false;

  const setupGame: WhimsyCanvasSetup = (gameCanvas, startPage) => {
    let canvasWidth = 0;
    let canvasHeight = 0;
    let camelVelX = 0;
    let camelVelY = 0;
    let camelDestination: StartPageItem = null;
    let boredWaypoint: { x: number; y: number } | null = null;
    let boredReturnDestination: StartPageItem = null;
    let sittingMs = 0;
    let camelAnimationTime = 0;
    const CAMEL_SIZE = 60;
    const CAMEL_SPEED = 210;
    const LANDING_DISTANCE = 16;
    const MAX_STEP_TIME = 40;
    const BORED_AFTER_MS = 12000;
    const JUMP_FREQUENCY = 10;
    const JUMP_AMPLITUDE = 6;
    let textTimer = 0;
    const TEXT_DURATION = 1000; // 1 second

    // Initialize camel position later once the canvas is sized
    camelX = 0;
    camelY = 0;

    function distanceBetween(x1: number, y1: number, x2: number, y2: number) {
      return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    function getLandingPoint(target: StartPageItem) {
      return {
        x: target.rect.centerX,
        y: target.rect.centerY,
      };
    }

    function getRandomVisiblePoint(width: number) {
      const margin = CAMEL_SIZE * 1.5;
      const minX = margin;
      const maxX = Math.max(minX, width - margin);
      const minY = window.scrollY + margin;
      const maxY = window.scrollY + Math.max(margin, window.innerHeight - margin);

      return {
        x: minX + Math.random() * (maxX - minX),
        y: minY + Math.random() * (maxY - minY),
      };
    }

    function chooseClosestTarget() {
      const targets = startPage
        .getItems()
        .filter(
          (item) =>
            item.kind === startPage.itemTypes.CARD ||
            item.kind === startPage.itemTypes.MENU_ITEM,
        );

      const fallbackX = Number.isFinite(startPage.mouse.x)
        ? startPage.mouse.x
        : window.scrollX + window.innerWidth / 2;
      const fallbackY = Number.isFinite(startPage.mouse.y)
        ? startPage.mouse.y
        : window.scrollY + window.innerHeight / 2;

      if (targets.length === 0) {
        return {
          id: "mouse",
          rect: {
            left: fallbackX,
            top: fallbackY,
            right: fallbackX,
            bottom: fallbackY,
            width: 0,
            height: 0,
            centerX: fallbackX,
            centerY: fallbackY,
          },
        } as StartPageItem;
      }

      let closestTarget = targets[0];
      let closestDistance = distanceBetween(
        fallbackX,
        fallbackY,
        closestTarget.rect.centerX,
        closestTarget.rect.centerY,
      );

      for (let target of targets) {
        const targetDistance = distanceBetween(
          fallbackX,
          fallbackY,
          target.rect.centerX,
          target.rect.centerY,
        );

        if (targetDistance < closestDistance) {
          closestTarget = target;
          closestDistance = targetDistance;
        }
      }

      return closestTarget;
    }

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

      const seconds = Math.min(stepTime || 16, MAX_STEP_TIME) / 1000;
      const nextDestination = chooseClosestTarget();

      if (
        !camelDestination ||
        nextDestination.id !== camelDestination.id ||
        (boredWaypoint && nextDestination.id === camelDestination?.id)
      ) {
        camelDestination = nextDestination;
        boredWaypoint = null;
        boredReturnDestination = null;
        sittingMs = 0;
      }

      let targetPoint = boredWaypoint || getLandingPoint(camelDestination);
      const landingPoint = getLandingPoint(camelDestination);
      const dx = targetPoint.x - camelX;
      const dy = targetPoint.y - camelY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const moving = distance > LANDING_DISTANCE;

      if (moving) {
        camelAnimationTime += seconds;
      }

      if (distance <= LANDING_DISTANCE) {
        camelX = targetPoint.x;
        camelY = targetPoint.y;
        camelVelX = 0;
        camelVelY = 0;

        if (boredWaypoint) {
          if (boredReturnDestination) {
            camelDestination = boredReturnDestination;
            boredReturnDestination = null;
          }
          boredWaypoint = null;
        } else {
          sittingMs += Math.min(stepTime || 16, MAX_STEP_TIME);
          if (sittingMs >= BORED_AFTER_MS) {
            boredReturnDestination = camelDestination;
            boredWaypoint = getRandomVisiblePoint(width);
            sittingMs = 0;
          }
        }
      } else {
        const distanceToMove = CAMEL_SPEED * seconds;
        const travelFraction = Math.min(1, distanceToMove / distance);
        camelX += dx * travelFraction;
        camelY += dy * travelFraction;
        camelVelX = (dx * travelFraction) / seconds;
        camelVelY = (dy * travelFraction) / seconds;
      }

      // Keep camel on screen
      camelX = Math.max(CAMEL_SIZE / 2, Math.min(width - CAMEL_SIZE / 2, camelX));
      camelY = Math.max(CAMEL_SIZE / 2, Math.min(height - CAMEL_SIZE / 2, camelY));

      // Clear canvas fully (avoids accidental over-bright fade hiding the camel)
      ctx.clearRect(0, 0, width, height);

      const angle = Math.atan2(camelVelY, camelVelX);
      const jumpPhase = camelAnimationTime * JUMP_FREQUENCY;
      const jumpProgress = moving ? Math.max(0, Math.sin(jumpPhase)) : 0;
      const jumpOffset = moving ? jumpProgress * JUMP_AMPLITUDE : 0;
      const bodyY = moving ? -6 : 0;
      const neckYOffset = moving ? -16 : -18;
      const headYOffset = moving ? -18 : -20;
      const legGroundY = 10;
      const liftedLegY = moving ? legGroundY - 18 : legGroundY;
      const groundedLegHeight = 18;
      const liftedLegHeight = moving ? 10 : groundedLegHeight;
      const tailLift = moving ? -6 : 6;

      if (!moving) {
        camelAnimationTime = 0;
      }

      const frontLeftY = liftedLegY;
      const frontRightY = liftedLegY;
      const backLeftY = liftedLegY;
      const backRightY = liftedLegY;
      const frontLeftHeight = liftedLegHeight;
      const frontRightHeight = liftedLegHeight;
      const backLeftHeight = liftedLegHeight;
      const backRightHeight = liftedLegHeight;

      // Draw camel
      ctx.save();
      ctx.translate(camelX, camelY - jumpOffset);
      ctx.rotate(angle);
      ctx.scale(1.5, 1.5);

      // Camel body (brighter colors + thicker stroke for visibility)
      ctx.fillStyle = "#ff9f3b";
      ctx.strokeStyle = "#6b3f13";
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.ellipse(0, bodyY, 20, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Humps
      ctx.beginPath();
      ctx.arc(-8, bodyY - 10, 8, Math.PI, 0);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(8, bodyY - 10, 8, Math.PI, 0);
      ctx.fill();
      ctx.stroke();

      // Neck
      ctx.fillRect(16, neckYOffset, 6, 20);
      ctx.strokeRect(16, neckYOffset, 6, 20);

      // Head
      ctx.beginPath();
      ctx.ellipse(24, headYOffset, 8, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Legs
      ctx.fillRect(-14, frontLeftY, 4, frontLeftHeight);
      ctx.strokeRect(-14, frontLeftY, 4, frontLeftHeight);
      ctx.fillRect(-4, frontRightY, 4, frontRightHeight);
      ctx.strokeRect(-4, frontRightY, 4, frontRightHeight);
      ctx.fillRect(6, backLeftY, 4, backLeftHeight);
      ctx.strokeRect(6, backLeftY, 4, backLeftHeight);
      ctx.fillRect(16, backRightY, 4, backRightHeight);
      ctx.strokeRect(16, backRightY, 4, backRightHeight);

      // Tail
      ctx.beginPath();
      ctx.moveTo(-20, tailLift);
      ctx.lineTo(-28, tailLift + 8);
      ctx.stroke();

      // Tail
      ctx.beginPath();
      ctx.moveTo(-20, -2);
      ctx.lineTo(-28, 6);
      ctx.stroke();

      // final visuals: no debug overlays

      ctx.restore();

      // Draw text with fade out (visible initially, then fades to 0 in TEXT_DURATION)
      if (textTimer > 0) {
        textOpacity = Math.max(0, textTimer / TEXT_DURATION);
        ctx.globalAlpha = textOpacity;
        ctx.font = "48px sans-serif";
        ctx.fillStyle = "rgba(255, 100, 0, 1)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const visibleCenterX = window.scrollX + window.innerWidth / 2;
        const visibleCenterY = window.scrollY + window.innerHeight / 3;
        ctx.fillText("Happy Hump Day!", visibleCenterX, visibleCenterY);
        ctx.globalAlpha = 1;
        textTimer -= stepTime || 16;
      }
    });

    // Subscribe to trigger — show camel when triggered, but do not auto-hide it.
    const unsubscribe = triggerCamel.subscribe((value) => {
      camelVisible = value;
      if (value) {
        // Reset camel position to the visible viewport or current mouse location.
        camelX = Number.isFinite(startPage.mouse.x)
          ? startPage.mouse.x
          : window.scrollX + window.innerWidth / 2;
        camelY = Number.isFinite(startPage.mouse.y)
          ? startPage.mouse.y
          : window.scrollY + window.innerHeight / 2;
        camelDestination = null;
        boredWaypoint = null;
        boredReturnDestination = null;
        camelVelX = 0;
        camelVelY = 0;
        sittingMs = 0;
        textTimer = TEXT_DURATION;
      }
    });

    return () => {
      unsubscribe();
    };
  };
</script>

<WhimsyCanvas mode="absolute" onLoad={setupGame} />

<style>
</style>
