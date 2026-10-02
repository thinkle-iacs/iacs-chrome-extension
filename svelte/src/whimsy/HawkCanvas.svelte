<script lang="ts">
  import FollowMouse from "./FollowMouse.svelte";
  import WhimsyCanvas from "./WhimsyCanvas.svelte";
  import { Sprite } from "simple-canvas-library/dist/Sprite";
  import type { StartPageItem, WhimsyCanvasSetup } from "./whimsyCanvas";

  const HAWK_SIZE = 64;

  const FLY_RIGHT = [0, 1, 2, 3];
  const FLUTTER = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
  const GLIDE_RIGHT = [0, 0, 0, 1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3];
  const LAND = [8, 9, 10, 11]; //, 10, 11];
  const SIT = [
    11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 10, 11, 11,
    10, 11, 10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11,
  ];
  const TAKE_OFF = [12, 13, 14, 15];
  const DEBUG_MODE = false;
  const LANDING_DISTANCE = 8;
  const HAWK_SPEED = 180; // Pixels per second
  const MAX_STEP_TIME = 40;
  const BORED_AFTER_MS = 12000;
  const RANDOM_FLIGHT_MARGIN = HAWK_SIZE * 1.5;

  type HawkPoint = {
    x: number;
    y: number;
  };

  function distanceBetween(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  }

  function getVisibleStartY() {
    return window.scrollY + window.innerHeight * 0.35;
  }

  function getLandingPoint(target: StartPageItem): HawkPoint {
    return {
      x: target.rect.centerX - HAWK_SIZE / 2,
      y: target.rect.top - HAWK_SIZE,
    };
  }

  function getRandomVisiblePoint(width: number): HawkPoint {
    let minX = RANDOM_FLIGHT_MARGIN;
    let maxX = Math.max(minX, width - RANDOM_FLIGHT_MARGIN);
    let visibleTop = window.scrollY;
    let minY = visibleTop + RANDOM_FLIGHT_MARGIN;
    let maxY = visibleTop + Math.max(RANDOM_FLIGHT_MARGIN, window.innerHeight - RANDOM_FLIGHT_MARGIN);

    return {
      x: minX + Math.random() * (maxX - minX),
      y: minY + Math.random() * (maxY - minY),
    };
  }

  const setupGame: WhimsyCanvasSetup = (gameCanvas, startPage) => {
    let hawk = new Sprite({
      src: "/sprites/hawk-sprite.png",
      frameWidth: 256,
      frameHeight: 256,
      targetWidth: HAWK_SIZE,
      targetHeight: HAWK_SIZE,
      frameSequence: [0, 1, 2, 3],
      frameRate: 8,
      x: -HAWK_SIZE * 1.5,
      y: getVisibleStartY(),
    });
    let hawkDestination: StartPageItem = null;
    let boredReturnDestination: StartPageItem = null;
    let boredWaypoint: HawkPoint = null;
    let flyingLeft = false;
    let sittingMs = 0;

    gameCanvas.addDrawing(hawk);

    gameCanvas.addDrawing(({ stepTime, ctx, width }) => {
      let seconds = Math.min(stepTime || 16, MAX_STEP_TIME) / 1000;
      let elapsedMs = Math.min(stepTime || 16, MAX_STEP_TIME);
      let targets = startPage
        .getItems()
        .filter((item) => item.kind === "card" || item.kind === "menu-item");
      // We target the item closest to the cursor...
      let closestTarget = targets[0];
      let closestDistance = distanceBetween(
        startPage.mouse.x,
        startPage.mouse.y,
        closestTarget.rect.centerX,
        closestTarget.rect.centerY,
      );
      // Search for the closest item...
      for (let target of targets) {
        let distance = distanceBetween(
          startPage.mouse.x,
          startPage.mouse.y,
          target.rect.centerX,
          target.rect.centerY,
        );
        // Draw target with distance measurement...
        if (DEBUG_MODE) {
          ctx.beginPath();
          ctx.rect(
            target.rect.left,
            target.rect.top,
            target.rect.width,
            target.rect.height,
          );
          ctx.strokeStyle = "#00f";
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = "#00f";
          ctx.font = "12px sans-serif";
          ctx.fillText(
            Math.round(distance).toString(),
            target.rect.centerX,
            target.rect.centerY,
          );
        }

        if (distance < closestDistance) {
          closestTarget = target;
          closestDistance = distance;
        }
      }
      if (hawkDestination == null || closestTarget.id != hawkDestination.id) {
        hawkDestination = closestTarget;
        boredWaypoint = null;
        boredReturnDestination = null;
        sittingMs = 0;

        if (hawk.frameSequence == LAND || hawk.frameSequence == SIT) {
          hawk.repeat = false;
          hawk.frameAnimationIndex = 0;
          hawk.frameSequence = TAKE_OFF;
        }

        // Debug outline target...
        ctx.beginPath();
        if (DEBUG_MODE) {
          ctx.rect(
            hawkDestination.rect.left,
            hawkDestination.rect.top,
            hawkDestination.rect.width,
            hawkDestination.rect.height,
          );
          ctx.strokeStyle = "#0f0";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      if (hawk.frameSequence == SIT && boredWaypoint == null) {
        sittingMs += elapsedMs;
        if (sittingMs >= BORED_AFTER_MS) {
          boredReturnDestination = hawkDestination;
          boredWaypoint = getRandomVisiblePoint(width);
          sittingMs = 0;

          hawk.repeat = false;
          hawk.frameAnimationIndex = 0;
          hawk.frameSequence = TAKE_OFF;
        }
      } else if (hawk.frameSequence != SIT) {
        sittingMs = 0;
      }

      if (
        hawk.frameSequence == TAKE_OFF &&
        hawk.frame === TAKE_OFF[TAKE_OFF.length - 1]
      ) {
        // finish take-off sequence

        hawk.repeat = true;
        hawk.frameAnimationIndex = 0;
        hawk.frameSequence = FLY_RIGHT;
      }

      let targetPoint = boredWaypoint || getLandingPoint(hawkDestination);
      let landingPoint = getLandingPoint(hawkDestination);
      let landingX = targetPoint.x;
      let landingY = targetPoint.y;
      let dx = landingX - hawk.x;
      let dy = landingY - hawk.y;
      let distanceToLanding = Math.sqrt(dx * dx + dy * dy);
      let reachedBoredWaypoint = false;

      if (
        boredWaypoint &&
        hawk.frameSequence != TAKE_OFF &&
        distanceToLanding <= LANDING_DISTANCE
      ) {
        hawk.x = boredWaypoint.x;
        hawk.y = boredWaypoint.y;
        boredWaypoint = null;
        if (boredReturnDestination) {
          hawkDestination = boredReturnDestination;
          boredReturnDestination = null;
        }
        reachedBoredWaypoint = true;
      }

      if (
        boredWaypoint == null &&
        !reachedBoredWaypoint &&
        hawk.frameSequence != TAKE_OFF &&
        hawk.frameSequence != LAND &&
        hawk.frameSequence != SIT &&
        distanceToLanding <= LANDING_DISTANCE
      ) {
        hawk.x = landingX;
        hawk.y = landingY;
        if (hawk.frameSequence != LAND) {

          hawk.repeat = false;
          hawk.frameAnimationIndex = 0;
          hawk.frameSequence = LAND;
        }
      } else if (
        !reachedBoredWaypoint &&
        hawk.frameSequence == LAND &&
        hawk.frame === LAND[LAND.length - 1]
      ) {

        hawk.repeat = true;
        hawk.frameAnimationIndex = 0;
        hawk.frameSequence = SIT;
      } else if (
        !reachedBoredWaypoint &&
        hawk.frameSequence != TAKE_OFF &&
        hawk.frameSequence != LAND &&
        hawk.frameSequence != SIT
      ) {
        let distanceToMove = HAWK_SPEED * seconds;
        let travelFraction = Math.min(1, distanceToMove / distanceToLanding);
        let debugMovement = `dx ${Math.round(dx)}, dy ${Math.round(dy)}`;

        if (dy < 0 && Math.abs(dy) > Math.abs(dx)) {
          if (DEBUG_MODE) {
            // Write "flutter" above hawk...
            ctx.fillStyle = "#f0f";
            ctx.font = "12px sans-serif";
            ctx.fillText(
              `flutter (${debugMovement})`,
              hawk.x,
              hawk.y - HAWK_SIZE / 2 - 10,
            );
          }
          if (hawk.frameSequence != FLUTTER) {
            hawk.frameAnimationIndex = 0;
          }
          hawk.frameSequence = FLUTTER;
        } else if (Math.abs(dy) * 2 > Math.abs(dx)) {
          // Write "fly"
          if (DEBUG_MODE) {
            ctx.fillStyle = "#f0f";
            ctx.font = "12px sans-serif";
            ctx.fillText(
              `fly (${debugMovement})`,
              hawk.x,
              hawk.y - HAWK_SIZE / 2 - 10,
            );
          }
          if (hawk.frameSequence != FLY_RIGHT) {
            hawk.frameAnimationIndex = 0;
          }
          hawk.frameSequence = FLY_RIGHT;
        } else {
          // Write "glide"
          if (DEBUG_MODE) {
            ctx.fillStyle = "#f0f";
            ctx.font = "12px sans-serif";
            ctx.fillText(
              `glide (${debugMovement})`,
              hawk.x,
              hawk.y - HAWK_SIZE / 2 - 10,
            );
          }
          if (hawk.frameSequence != GLIDE_RIGHT) {
            hawk.frameAnimationIndex = 0;
          }
          hawk.frameSequence = GLIDE_RIGHT;
        }

        hawk.x += dx * travelFraction;
        hawk.y += dy * travelFraction;

        if (hawk.repeat != true) {

          hawk.repeat = true;
        }
        flyingLeft = dx < 0;
        hawk.flipHorizontal = flyingLeft;
      }

      if (DEBUG_MODE) {
        ctx.beginPath();
        ctx.arc(landingPoint.x, landingPoint.y, LANDING_DISTANCE, 0, Math.PI * 2);
        ctx.strokeStyle = "#f00";
        ctx.lineWidth = 2;
        ctx.stroke();

        if (boredWaypoint) {
          ctx.beginPath();
          ctx.arc(boredWaypoint.x, boredWaypoint.y, LANDING_DISTANCE, 0, Math.PI * 2);
          ctx.strokeStyle = "#ff0";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    });

  };
</script>

<WhimsyCanvas onLoad={setupGame} />
