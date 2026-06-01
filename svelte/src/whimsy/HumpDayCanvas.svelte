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
  let textMessage = "Happy Hump Day!";

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
    const CLICK_HOP_DURATION = 260;
    const CLICK_HOP_HEIGHT = 22;
    const CLICK_MESSAGE = "Created by Adam Class of 2027";
    let clickHopTimer = 0;
    let textTimer = 0;
    const TEXT_DURATION = 2000; // 2 seconds

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
      const clickHopProgress = clickHopTimer > 0 ? Math.sin((1 - clickHopTimer / CLICK_HOP_DURATION) * Math.PI) : 0;
      const clickHopOffset = clickHopProgress * CLICK_HOP_HEIGHT;
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

      if (clickHopTimer > 0) {
        clickHopTimer = Math.max(0, clickHopTimer - (stepTime || 16));
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
      ctx.translate(camelX, camelY - jumpOffset - clickHopOffset);
      ctx.rotate(angle);
      ctx.scale(1.5, 1.5);

      // Camel body (brighter colors + thicker stroke for visibility)
      ctx.fillStyle = "#d4a574";
      ctx.strokeStyle = "#8b6f47";
      ctx.lineWidth = 2;

      // Body
      ctx.beginPath();
      ctx.ellipse(0, bodyY, 22, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Humps - larger and more rounded
      ctx.fillStyle = "#c89968";
      ctx.beginPath();
      ctx.ellipse(-10, bodyY - 14, 10, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(8, bodyY - 12, 9, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Neck - tapered
      ctx.fillStyle = "#d4a574";
      ctx.beginPath();
      ctx.moveTo(18, neckYOffset + 4);
      ctx.lineTo(24, neckYOffset - 6);
      ctx.lineTo(26, neckYOffset - 6);
      ctx.lineTo(20, neckYOffset + 4);
      ctx.fill();
      ctx.stroke();

      // Head - more detailed
      ctx.beginPath();
      ctx.ellipse(28, headYOffset, 7, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Ears
      ctx.fillStyle = "#c89968";
      ctx.beginPath();
      ctx.ellipse(26, headYOffset - 8, 2, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(30, headYOffset - 8, 2, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Eyes
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(26, headYOffset - 1, 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(30, headYOffset - 1, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Snout
      ctx.fillStyle = "#d4a574";
      ctx.strokeStyle = "#8b6f47";
      ctx.beginPath();
      ctx.ellipse(34, headYOffset + 2, 3, 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Legs - more realistic with hooves
      ctx.fillStyle = "#a68567";
      ctx.strokeStyle = "#8b6f47";
      ctx.lineWidth = 2;

      // Front left leg
      ctx.fillRect(-16, frontLeftY, 5, frontLeftHeight);
      ctx.strokeRect(-16, frontLeftY, 5, frontLeftHeight);
      // Hoof
      ctx.fillRect(-18, frontLeftY + frontLeftHeight - 1, 9, 3);
      ctx.strokeRect(-18, frontLeftY + frontLeftHeight - 1, 9, 3);

      // Front right leg
      ctx.fillRect(-4, frontRightY, 5, frontRightHeight);
      ctx.strokeRect(-4, frontRightY, 5, frontRightHeight);
      // Hoof
      ctx.fillRect(-6, frontRightY + frontRightHeight - 1, 9, 3);
      ctx.strokeRect(-6, frontRightY + frontRightHeight - 1, 9, 3);

      // Back left leg
      ctx.fillRect(6, backLeftY, 5, backLeftHeight);
      ctx.strokeRect(6, backLeftY, 5, backLeftHeight);
      // Hoof
      ctx.fillRect(4, backLeftY + backLeftHeight - 1, 9, 3);
      ctx.strokeRect(4, backLeftY + backLeftHeight - 1, 9, 3);

      // Back right leg
      ctx.fillRect(16, backRightY, 5, backRightHeight);
      ctx.strokeRect(16, backRightY, 5, backRightHeight);
      // Hoof
      ctx.fillRect(14, backRightY + backRightHeight - 1, 9, 3);
      ctx.strokeRect(14, backRightY + backRightHeight - 1, 9, 3);

      // Tail - fluffy
      ctx.strokeStyle = "#8b6f47";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-22, tailLift);
      ctx.quadraticCurveTo(-28, tailLift + 2, -30, tailLift + 8);
      ctx.stroke();

      // Tail tuft
      ctx.fillStyle = "#a68567";
      ctx.beginPath();
      ctx.ellipse(-30, tailLift + 10, 3, 4, 0, 0, Math.PI * 2);
      ctx.fill();

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
        ctx.fillText(textMessage, visibleCenterX, visibleCenterY);
        ctx.globalAlpha = 1;
        textTimer -= stepTime || 16;
      }
    });

    // Subscribe to trigger — show camel when triggered, but do not auto-hide it.
    let ignoreCamelClickUntil = 0;

    function handleWindowClick(event: MouseEvent) {
      if (!camelVisible) {
        return;
      }

      if (performance.now() < ignoreCamelClickUntil) {
        return;
      }

      const clickX = event.clientX + window.scrollX;
      const clickY = event.clientY + window.scrollY;
      const distance = distanceBetween(clickX, clickY, camelX, camelY);

      if (distance <= CAMEL_SIZE * 0.75) {
        textMessage = CLICK_MESSAGE;
        textTimer = TEXT_DURATION;
        clickHopTimer = CLICK_HOP_DURATION;
      }
    }

    window.addEventListener("click", handleWindowClick);

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
        textMessage = "Happy Hump Day!";
        textTimer = TEXT_DURATION;
        ignoreCamelClickUntil = performance.now() + 120;
      }
    });

    return () => {
      unsubscribe();
      window.removeEventListener("click", handleWindowClick);
    };
  };
</script>
// Adam Class of 2027
<WhimsyCanvas mode="absolute" onLoad={setupGame} />

<style>
</style>
