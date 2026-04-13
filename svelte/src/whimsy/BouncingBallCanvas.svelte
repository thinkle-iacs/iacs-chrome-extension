<script lang="ts">
  import { GameCanvas } from "simple-canvas-library/dist/simple-canvas-library.es.js";
  import { onDestroy, onMount } from "svelte";
  import {
    createWhimsyCanvas,
    type WhimsyCanvasMode,
    type WhimsyTarget,
  } from "./whimsyCanvas";

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

  type ResizableGameCanvas = GameCanvas & {
    setCanvasSize: (width: number, height: number) => void;
  };

  const layer = createWhimsyCanvas({
    mode,
    useDevicePixelRatio: false,
  });

  const TARGET_KINDS = ["menu-icon", "menu-item", "card", "menu"];
  const SPEED = 280;
  const HIT_GLOW_MS = 180;
  const ZONE_COOLDOWN_MS = 140;

  let canvas: HTMLCanvasElement;
  let gameCanvas: GameCanvas | null = null;
  let hitGlowUntil = 0;
  let lastHitTarget: WhimsyTarget | null = null;
  let lastHitColor = "#e6552d";
  let zoneCooldowns = new Map<string, number>();

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
    return TARGET_KINDS.flatMap((kind) => layer.getTargets(kind)).sort((a, b) => {
      return a.rect.width * a.rect.height - b.rect.width * b.rect.height;
    });
  }

  function intersectsTarget(target: WhimsyTarget) {
    const nearestX = clamp(ball.x, target.rect.left, target.rect.right);
    const nearestY = clamp(ball.y, target.rect.top, target.rect.bottom);
    const dx = ball.x - nearestX;
    const dy = ball.y - nearestY;
    return dx * dx + dy * dy <= ball.radius * ball.radius;
  }

  function registerHit(target: WhimsyTarget, now: number) {
    lastHitTarget = target;
    hitGlowUntil = now + HIT_GLOW_MS;
    lastHitColor = getHitColor(target.kind);
  }

  function getHitColor(kind: string) {
    if (kind === "card") {
      return "#e6552d";
    }
    if (kind === "menu") {
      return "#2f6fed";
    }
    if (kind === "menu-item") {
      return "#5789f5";
    }
    if (kind === "menu-icon") {
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
    target: WhimsyTarget,
    previousX: number,
    previousY: number,
    now: number
  ) {
    if (!intersectsTarget(target)) {
      return false;
    }

    if (!isSolid(target.kind)) {
      const cooldownUntil = zoneCooldowns.get(target.id) || 0;
      if (now >= cooldownUntil) {
        applyCollisionResponse(target.kind);
        registerHit(target, now);
        zoneCooldowns.set(target.id, now + ZONE_COOLDOWN_MS);
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
      registerHit(target, now);
      return true;
    }

    if (wasRight) {
      ball.x = expanded.right;
      ball.vx = Math.abs(ball.vx);
      applyCollisionResponse(target.kind);
      registerHit(target, now);
      return true;
    }

    if (wasAbove) {
      ball.y = expanded.top;
      ball.vy = -Math.abs(ball.vy);
      applyCollisionResponse(target.kind);
      registerHit(target, now);
      return true;
    }

    if (wasBelow) {
      ball.y = expanded.bottom;
      ball.vy = Math.abs(ball.vy);
      applyCollisionResponse(target.kind);
      registerHit(target, now);
      return true;
    }

    const corrections = [
      {
        distance: Math.abs(ball.x - expanded.left),
        apply: () => {
          ball.x = expanded.left;
          ball.vx = -Math.abs(ball.vx);
        },
      },
      {
        distance: Math.abs(expanded.right - ball.x),
        apply: () => {
          ball.x = expanded.right;
          ball.vx = Math.abs(ball.vx);
        },
      },
      {
        distance: Math.abs(ball.y - expanded.top),
        apply: () => {
          ball.y = expanded.top;
          ball.vy = -Math.abs(ball.vy);
        },
      },
      {
        distance: Math.abs(expanded.bottom - ball.y),
        apply: () => {
          ball.y = expanded.bottom;
          ball.vy = Math.abs(ball.vy);
        },
      },
    ];

    corrections.sort((a, b) => a.distance - b.distance);
    corrections[0].apply();
    applyCollisionResponse(target.kind);
    registerHit(target, now);
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

  function updateBall(elapsed: number, width: number, height: number, targets: WhimsyTarget[], now: number) {
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

  function drawTargetGlow(ctx: CanvasRenderingContext2D, now: number) {
    if (!lastHitTarget || now > hitGlowUntil) {
      return;
    }

    const alpha = (hitGlowUntil - now) / HIT_GLOW_MS;
    const rect = lastHitTarget.rect;

    ctx.save();
    const glowAlpha = Math.max(alpha * 0.55, 0);
    const label = lastHitTarget.kind.replace("-", " ");
    ctx.strokeStyle = `${lastHitColor}${Math.round(glowAlpha * 255)
      .toString(16)
      .padStart(2, "0")}`;
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 8]);
    ctx.strokeRect(rect.left, rect.top, rect.width, rect.height);
    ctx.setLineDash([]);
    ctx.fillStyle = `rgba(15, 23, 42, ${Math.max(alpha * 0.85, 0)})`;
    ctx.fillRect(rect.left, Math.max(0, rect.top - 20), 88, 18);
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(alpha, 0)})`;
    ctx.font = "12px sans-serif";
    ctx.fillText(label, rect.left + 6, Math.max(13, rect.top - 7));
    ctx.restore();
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
    const layerSize = layer.getCanvasSize();
    if (
      gameCanvas &&
      (width !== layerSize.width || height !== layerSize.height)
    ) {
      (gameCanvas as ResizableGameCanvas).setCanvasSize(
        layerSize.width,
        layerSize.height
      );
      width = layerSize.width;
      height = layerSize.height;
    }

    const targets = getBounceTargets();
    initializeBall(width, height);
    updateBall(stepTime, width, height, targets, timestamp);

    drawTargetGlow(ctx, timestamp);
    drawBall(ctx);
  }

  onMount(() => {
    layer.attach(canvas);
    gameCanvas = new GameCanvas(canvas, {
      autoresize: true,
    });
    gameCanvas.addDrawing(draw);
    gameCanvas.run();
  });

  $: layer.setMode(mode);

  onDestroy(() => {
    gameCanvas?.stop();
    gameCanvas = null;
    zoneCooldowns.clear();
    layer.destroy();
  });
</script>

<canvas bind:this={canvas} />

<style>
  canvas {
    width: 100%;
    height: 100%;
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999999;
  }
</style>
