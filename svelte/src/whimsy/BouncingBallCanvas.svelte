<script lang="ts">
  import type {
    StartPage,
    StartPageItem,
    WhimsyGameCanvas,
    WhimsyCanvasMode,
  } from "./whimsyCanvas";
  import WhimsyCanvas from "./WhimsyCanvas.svelte";

  export let mode: WhimsyCanvasMode = "absolute";

  type Ball = {
    color: string;
    radius: number;
    vx: number;
    vy: number;
    x: number;
    y: number;
  };

  type CanvasDrawingParams = {
    ctx: CanvasRenderingContext2D;
    stepTime: number;
    timestamp: number;
    width: number;
    height: number;
  };

  const SPEED = 280;
  const ZONE_COOLDOWN_MS = 140;

  let startPage: StartPage;
  let zoneCooldowns: { [targetId: string]: number } = {};

  let ball: Ball = {
    x: 120,
    y: 120,
    vx: SPEED,
    vy: SPEED * 0.72,
    radius: 16,
    color: "#e6552d",
  };

  function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
  }

  function getBounceTargets() {
    let targets: StartPageItem[] = [];
    let itemTypes = startPage.itemTypes;
    let targetKinds = [
      itemTypes.MENU_ICON,
      itemTypes.MENU_ITEM,
      itemTypes.CARD,
      itemTypes.MENU,
    ];

    for (let kind of targetKinds) {
      let matchingTargets = startPage.getItems(kind);

      for (let target of matchingTargets) {
        targets.push(target);
      }
    }

    targets.sort(compareTargetSize);
    return targets;
  }

  function compareTargetSize(a: StartPageItem, b: StartPageItem) {
    let areaA = a.rect.width * a.rect.height;
    let areaB = b.rect.width * b.rect.height;
    return areaA - areaB;
  }

  function intersectsTarget(target: StartPageItem) {
    const nearestX = clamp(ball.x, target.rect.left, target.rect.right);
    const nearestY = clamp(ball.y, target.rect.top, target.rect.bottom);
    const dx = ball.x - nearestX;
    const dy = ball.y - nearestY;
    return dx * dx + dy * dy <= ball.radius * ball.radius;
  }

  function registerContact(kind: string) {
    ball.color = getContactColor(kind);
  }

  function getContactColor(kind: string) {
    if (kind === "menu") {
      return "#2f6fed";
    }
    if (kind === "menu-item") {
      return "#0033a0";
    }
    if (kind === "menu-icon") {
      return "#c6093b";
    }
    if (kind === "card") {
      return "#19a974";
    }
    return "#e6552d";
  }

  function isSolid(kind: string) {
    return kind === "card" || kind === "menu-icon";
  }

  function applyCollisionResponse(kind: string) {
    if (kind === "menu") {
      ball.vx *= 0.8;
      ball.vy *= 0.8;
    } else if (kind === "menu-item") {
      ball.vx *= 0.9;
      ball.vy *= 0.9;
    } else if (kind === "menu-icon") {
      ball.vx *= 0.97;
      ball.vy *= 0.97;
    } else if (kind === "card") {
      ball.vx *= 1.01;
      ball.vy *= 1.01;
    }

    const currentSpeed = Math.hypot(ball.vx, ball.vy);
    if (currentSpeed < SPEED * 0.35) {
      const scale = (SPEED * 0.35) / Math.max(currentSpeed, 1);
      ball.vx *= scale;
      ball.vy *= scale;
    }
    if (currentSpeed > SPEED * 1.6) {
      const scale = (SPEED * 1.6) / currentSpeed;
      ball.vx *= scale;
      ball.vy *= scale;
    }
  }

  function resolveTargetCollision(
    target: StartPageItem,
    previousX: number,
    previousY: number,
    now: number
  ) {
    if (!intersectsTarget(target)) {
      return false;
    }

    if (!isSolid(target.kind)) {
      const cooldownUntil = zoneCooldowns[target.id] || 0;
      if (now >= cooldownUntil) {
        applyCollisionResponse(target.kind);
        registerContact(target.kind);
        zoneCooldowns[target.id] = now + ZONE_COOLDOWN_MS;
      }
      return true;
    }

    const expanded = {
      left: target.rect.left - ball.radius,
      right: target.rect.right + ball.radius,
      top: target.rect.top - ball.radius,
      bottom: target.rect.bottom + ball.radius,
    };

    const wasLeft = previousX <= expanded.left;
    const wasRight = previousX >= expanded.right;
    const wasAbove = previousY <= expanded.top;
    const wasBelow = previousY >= expanded.bottom;

    if (wasLeft) {
      ball.x = expanded.left;
      ball.vx = -Math.abs(ball.vx);
      applyCollisionResponse(target.kind);
      registerContact(target.kind);
      return true;
    }

    if (wasRight) {
      ball.x = expanded.right;
      ball.vx = Math.abs(ball.vx);
      applyCollisionResponse(target.kind);
      registerContact(target.kind);
      return true;
    }

    if (wasAbove) {
      ball.y = expanded.top;
      ball.vy = -Math.abs(ball.vy);
      applyCollisionResponse(target.kind);
      registerContact(target.kind);
      return true;
    }

    if (wasBelow) {
      ball.y = expanded.bottom;
      ball.vy = Math.abs(ball.vy);
      applyCollisionResponse(target.kind);
      registerContact(target.kind);
      return true;
    }

    const distanceFromLeft = Math.abs(ball.x - expanded.left);
    const distanceFromRight = Math.abs(expanded.right - ball.x);
    const distanceFromTop = Math.abs(ball.y - expanded.top);
    const distanceFromBottom = Math.abs(expanded.bottom - ball.y);

    let smallestDistance = distanceFromLeft;
    let side = "left";

    if (distanceFromRight < smallestDistance) {
      smallestDistance = distanceFromRight;
      side = "right";
    }

    if (distanceFromTop < smallestDistance) {
      smallestDistance = distanceFromTop;
      side = "top";
    }

    if (distanceFromBottom < smallestDistance) {
      smallestDistance = distanceFromBottom;
      side = "bottom";
    }

    if (side === "left") {
      ball.x = expanded.left;
      ball.vx = -Math.abs(ball.vx);
    } else if (side === "right") {
      ball.x = expanded.right;
      ball.vx = Math.abs(ball.vx);
    } else if (side === "top") {
      ball.y = expanded.top;
      ball.vy = -Math.abs(ball.vy);
    } else {
      ball.y = expanded.bottom;
      ball.vy = Math.abs(ball.vy);
    }

    applyCollisionResponse(target.kind);
    registerContact(target.kind);
    return true;
  }

  function bounceAgainstBounds(width: number, height: number) {
    if (ball.x - ball.radius < 0) {
      ball.x = ball.radius;
      ball.vx = Math.abs(ball.vx);
    } else if (ball.x + ball.radius > width) {
      ball.x = width - ball.radius;
      ball.vx = -Math.abs(ball.vx);
    }

    if (ball.y - ball.radius < 0) {
      ball.y = ball.radius;
      ball.vy = Math.abs(ball.vy);
    } else if (ball.y + ball.radius > height) {
      ball.y = height - ball.radius;
      ball.vy = -Math.abs(ball.vy);
    }
  }

  function initializeBall(width: number, height: number) {
    if (ball.x <= width && ball.y <= height) {
      return;
    }

    ball.x = Math.min(width * 0.33, width - ball.radius * 2);
    ball.y = Math.min(120, height - ball.radius * 2);
  }

  function updateBall(elapsed: number, width: number, height: number, targets: StartPageItem[], now: number) {
    const cappedElapsed = Math.min(elapsed || 16, 32) / 1000;
    const speed = Math.hypot(ball.vx, ball.vy);
    const substeps = Math.max(1, Math.ceil((speed * cappedElapsed) / ball.radius));
    const stepElapsed = cappedElapsed / substeps;

    for (let step = 0; step < substeps; step += 1) {
      const previousX = ball.x;
      const previousY = ball.y;

      ball.x += ball.vx * stepElapsed;
      ball.y += ball.vy * stepElapsed;

      bounceAgainstBounds(width, height);

      for (let target of targets) {
        if (resolveTargetCollision(target, previousX, previousY, now)) {
          break;
        }
      }
    }
  }

  function drawBall(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = ball.color;
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.arc(
      ball.x - ball.radius * 0.35,
      ball.y - ball.radius * 0.35,
      ball.radius * 0.28,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.restore();
  }

  function draw({ ctx, stepTime, timestamp, width, height }: CanvasDrawingParams) {
    const targets = getBounceTargets();
    initializeBall(width, height);
    updateBall(stepTime, width, height, targets, timestamp);

    drawBall(ctx);
  }

  function setupGame(
    gameCanvas: WhimsyGameCanvas,
    page: StartPage
  ) {
    startPage = page;
    gameCanvas.addDrawing(draw);
  }

  function clearGame() {
    zoneCooldowns = {};
  }
</script>

<WhimsyCanvas {mode} onLoad={setupGame} onUnload={clearGame} />
