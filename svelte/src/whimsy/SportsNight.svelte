<script lang="ts">
  import type { WhimsyCanvasMode, WhimsyCanvasSetup, WhimsyRect } from "./whimsyCanvas";
  import WhimsyCanvas from "./WhimsyCanvas.svelte";
  import { onMount } from "svelte";
// Created by Jayden Conde (and AI)
  type SportsDayEntry = {
    day: string; // ISO date string: YYYY-MM-DD
    sport: string;
  };

  const listOfSportsDays: SportsDayEntry[] = [
    // Add sports days here with exact dates and sport names.
    // Supported ball animations: volleyball, basketball, soccer, baseball, tennis.
    // Any other sport still works as plain text with the same overlay style.
    { day: "2026-05-29", sport: "Girls Volleyball" },
    { day: "2026-06-03", sport: "Boys Soccer" },
    // Example: { day: "2026-06-10", sport: "Boys Volleyball" },
    // Example: { day: "2026-06-12", sport: "Girls Soccer" },
  ];

  function formatISODate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const todayKey = formatISODate(new Date());
  const sportsDay = listOfSportsDays.find((entry) => entry.day === todayKey);

  export let mode: WhimsyCanvasMode = "fixed";

  let overlayHidden = false;

  function hideOverlay() {
    overlayHidden = true;
  }

  const setup: WhimsyCanvasSetup = (gameCanvas, startPage) => {
    const hawkImage = new Image();
    hawkImage.src = "/hawk.png";

    const sportKey = sportsDay ? sportsDay.sport.toLowerCase() : "";
    const sportBallUrl = sportKey.includes("volley")
      ? "/volleyball.png"
      : sportKey.includes("basket")
      ? "/basketball.png"
      : sportKey.includes("soccer")
      ? "/soccerball.png"
      : sportKey.includes("baseball")
      ? "/baseball.png"
      : sportKey.includes("tennis")
      ? "/tennisball.png"
      : null;

    const ballImage = sportBallUrl ? new Image() : null;
    if (ballImage) ballImage.src = sportBallUrl;

    let angle = 0;
    let bounce = 0;
    let ballSpawned = false;
    let ballObject: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      rotation: number;
      vr: number;
      image: HTMLImageElement;
    } | null = null;

    let overlayX = 0;
    let overlayY = 0;
    let overlayWidth = 0;
    let overlayHeight = 0;

    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

    const handleWindowClick = (event: MouseEvent) => {
      if (overlayHidden) return;
      const x = event.clientX;
      const y = event.clientY;

      if (ballObject) {
        const ballRadius = ballObject.size / 2;
        if (
          x > ballObject.x - ballRadius &&
          x < ballObject.x + ballRadius &&
          y > ballObject.y - ballRadius &&
          y < ballObject.y + ballRadius
        ) {
          const speed = 100 + Math.random() * 260;
          const angle = Math.random() * Math.PI * 2;
          ballObject.vx = Math.cos(angle) * speed;
          ballObject.vy = Math.sin(angle) * speed;
          return;
        }
      }

      const closeButtonSize = 20;
      const closeButtonX = overlayX + overlayWidth - 18;
      const closeButtonY = overlayY + 12;
      if (
        x > closeButtonX - closeButtonSize / 2 &&
        x < closeButtonX + closeButtonSize / 2 &&
        y > closeButtonY - closeButtonSize / 2 &&
        y < closeButtonY + closeButtonSize / 2
      ) {
        hideOverlay();
        ballObject = null;
      }
    };

    function getBounceTargets() {
      const targets: Array<{ rect: WhimsyRect; kind: string; id: string }> = [];
      let overlayId = 0;

      for (const element of Array.from(document.body.querySelectorAll<HTMLElement>("*"))) {
        if (element.tagName === "CANVAS") {
          continue;
        }

        const style = window.getComputedStyle(element);
        if (
          style.position !== "fixed" ||
          style.display === "none" ||
          style.visibility === "hidden" ||
          parseFloat(style.opacity) === 0
        ) {
          continue;
        }

        const rect = element.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) {
          continue;
        }

        targets.push({
          id: `fixed-overlay-${overlayId}`,
          kind: "fixed-overlay",
          rect: {
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height,
            centerX: rect.left + rect.width / 2,
            centerY: rect.top + rect.height / 2,
          },
        });
        overlayId += 1;
      }

      if (overlayWidth > 0 && overlayHeight > 0) {
        targets.push({
          id: "sports-overlay",
          kind: "overlay",
          rect: {
            left: overlayX,
            top: overlayY,
            right: overlayX + overlayWidth,
            bottom: overlayY + overlayHeight,
            width: overlayWidth,
            height: overlayHeight,
            centerX: overlayX + overlayWidth / 2,
            centerY: overlayY + overlayHeight / 2,
          },
        });
      }

      return targets;
    }

    function intersectsTarget(target: { rect: WhimsyRect }) {
      const nearestX = clamp(ballObject!.x, target.rect.left, target.rect.right);
      const nearestY = clamp(ballObject!.y, target.rect.top, target.rect.bottom);
      const dx = ballObject!.x - nearestX;
      const dy = ballObject!.y - nearestY;
      const radius = ballObject!.size / 2;
      return dx * dx + dy * dy <= radius * radius;
    }

    function applyCollisionResponse() {
      ballObject!.vx *= 0.96;
      ballObject!.vy *= 0.96;
    }

    function resolveTargetCollision(target: { rect: WhimsyRect; kind: string }, previousX: number, previousY: number) {
      if (!intersectsTarget(target)) {
        return false;
      }

      const radius = ballObject!.size / 2;
      const expanded = {
        left: target.rect.left - radius,
        right: target.rect.right + radius,
        top: target.rect.top - radius,
        bottom: target.rect.bottom + radius,
      };

      const wasLeft = previousX <= expanded.left;
      const wasRight = previousX >= expanded.right;
      const wasAbove = previousY <= expanded.top;
      const wasBelow = previousY >= expanded.bottom;

      if (wasLeft) {
        ballObject!.x = expanded.left;
        ballObject!.vx = -Math.abs(ballObject!.vx);
        applyCollisionResponse();
        return true;
      }
      if (wasRight) {
        ballObject!.x = expanded.right;
        ballObject!.vx = Math.abs(ballObject!.vx);
        applyCollisionResponse();
        return true;
      }
      if (wasAbove) {
        ballObject!.y = expanded.top;
        ballObject!.vy = -Math.abs(ballObject!.vy);
        applyCollisionResponse();
        return true;
      }
      if (wasBelow) {
        ballObject!.y = expanded.bottom;
        ballObject!.vy = Math.abs(ballObject!.vy);
        applyCollisionResponse();
        return true;
      }

      const distanceFromLeft = Math.abs(ballObject!.x - expanded.left);
      const distanceFromRight = Math.abs(expanded.right - ballObject!.x);
      const distanceFromTop = Math.abs(ballObject!.y - expanded.top);
      const distanceFromBottom = Math.abs(expanded.bottom - ballObject!.y);

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
        ballObject!.x = expanded.left;
        ballObject!.vx = -Math.abs(ballObject!.vx);
      } else if (side === "right") {
        ballObject!.x = expanded.right;
        ballObject!.vx = Math.abs(ballObject!.vx);
      } else if (side === "top") {
        ballObject!.y = expanded.top;
        ballObject!.vy = -Math.abs(ballObject!.vy);
      } else {
        ballObject!.y = expanded.bottom;
        ballObject!.vy = Math.abs(ballObject!.vy);
      }
      applyCollisionResponse();
      return true;
    }

    function bounceAgainstBounds(width: number, height: number) {
      const radius = ballObject!.size / 2;
      if (ballObject!.x - radius < 0) {
        ballObject!.x = radius;
        ballObject!.vx = Math.abs(ballObject!.vx);
      } else if (ballObject!.x + radius > width) {
        ballObject!.x = width - radius;
        ballObject!.vx = -Math.abs(ballObject!.vx);
      }
      if (ballObject!.y - radius < 0) {
        ballObject!.y = radius;
        ballObject!.vy = Math.abs(ballObject!.vy);
      } else if (ballObject!.y + radius > height) {
        ballObject!.y = height - radius;
        ballObject!.vy = -Math.abs(ballObject!.vy);
      }
    }

    function updateBall(elapsed: number, width: number, height: number, targets: Array<{ rect: WhimsyRect; kind: string; id: string }>) {
      const cappedElapsed = Math.min(elapsed || 16, 32) / 1000;
      const speed = Math.hypot(ballObject!.vx, ballObject!.vy);
      const substeps = Math.max(1, Math.ceil((speed * cappedElapsed) / ballObject!.size));
      const stepElapsed = cappedElapsed / substeps;

      for (let step = 0; step < substeps; step += 1) {
        const previousX = ballObject!.x;
        const previousY = ballObject!.y;
        ballObject!.x += ballObject!.vx * stepElapsed;
        ballObject!.y += ballObject!.vy * stepElapsed;
        bounceAgainstBounds(width, height);
        for (const target of targets) {
          if (resolveTargetCollision(target, previousX, previousY)) {
            break;
          }
        }
      }
    }

    window.addEventListener("click", handleWindowClick);

    gameCanvas.addDrawing(({ ctx, width, height, stepTime }) => {
      const elapsed = Math.min(stepTime || 16, 100);
      angle += (elapsed / 1000) * 0.7;
      bounce += (elapsed / 1000) * 0.9;

      overlayWidth = Math.min(420, width * 0.42);
      overlayHeight = 140;
      overlayX = 24;
      overlayY = height - overlayHeight - 24 + Math.sin(angle * 1.2) * 4;
      const imageSize = 92;
      const imageX = overlayX + overlayWidth - 90;
      const imageY = overlayY + overlayHeight / 2;
      const overlayColor = "#0033a0";

      if (overlayHidden) {
        ballObject = null;
        return;
      }

      if (!ballObject && !ballSpawned && ballImage) {
        ballSpawned = true;
        const radius = 22;
        const initialAngle = Math.PI / 9 + (Math.random() * 0.4 - 0.2);
        const initialSpeed = 100 + Math.random() * 120;
        const spawnY = Math.max(radius + 24, overlayY - 64);
        ballObject = {
          x: -radius,
          y: spawnY,
          vx: Math.cos(initialAngle) * initialSpeed,
          vy: Math.sin(initialAngle) * initialSpeed,
          size: radius * 2,
          rotation: 0,
          vr: 6,
          image: ballImage,
        };
      }

      if (ballObject) {
        ballObject.rotation += (ballObject.vr * elapsed) / 1000;
        const targets = getBounceTargets();
        updateBall(elapsed, width, height, targets);
      }

      // Bottom-left sports overlay box with animation
      ctx.save();
      ctx.fillStyle = overlayColor;
      ctx.shadowColor = "rgba(0, 51, 160, 0.45)";
      ctx.shadowBlur = 22;
      ctx.beginPath();
      ctx.moveTo(overlayX + 16, overlayY);
      ctx.lineTo(overlayX + overlayWidth - 16, overlayY);
      ctx.quadraticCurveTo(overlayX + overlayWidth, overlayY, overlayX + overlayWidth, overlayY + 16);
      ctx.lineTo(overlayX + overlayWidth, overlayY + overlayHeight - 16);
      ctx.quadraticCurveTo(
        overlayX + overlayWidth,
        overlayY + overlayHeight,
        overlayX + overlayWidth - 16,
        overlayY + overlayHeight
      );
      ctx.lineTo(overlayX + 16, overlayY + overlayHeight);
      ctx.quadraticCurveTo(overlayX, overlayY + overlayHeight, overlayX, overlayY + overlayHeight - 16);
      ctx.lineTo(overlayX, overlayY + 16);
      ctx.quadraticCurveTo(overlayX, overlayY, overlayX + 16, overlayY);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(overlayX + 16, overlayY);
      ctx.lineTo(overlayX + overlayWidth - 16, overlayY);
      ctx.quadraticCurveTo(overlayX + overlayWidth, overlayY, overlayX + overlayWidth, overlayY + 16);
      ctx.lineTo(overlayX + overlayWidth, overlayY + overlayHeight - 16);
      ctx.quadraticCurveTo(
        overlayX + overlayWidth,
        overlayY + overlayHeight,
        overlayX + overlayWidth - 16,
        overlayY + overlayHeight
      );
      ctx.lineTo(overlayX + 16, overlayY + overlayHeight);
      ctx.quadraticCurveTo(overlayX, overlayY + overlayHeight, overlayX, overlayY + overlayHeight - 16);
      ctx.lineTo(overlayX, overlayY + 16);
      ctx.quadraticCurveTo(overlayX, overlayY, overlayX + 16, overlayY);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      // Right-middle white circle placeholder on overlay
      ctx.save();
      ctx.fillStyle = "white";
      ctx.globalAlpha = 0.32;
      ctx.beginPath();
      ctx.arc(imageX, imageY, imageSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (hawkImage.complete && hawkImage.naturalWidth > 0) {
        ctx.save();
        ctx.globalAlpha = 0.65;
        ctx.drawImage(hawkImage, imageX - imageSize / 2, imageY - imageSize / 2, imageSize, imageSize);
        ctx.restore();
      }

      if (ballObject) {
        ctx.save();
        ctx.globalAlpha = ballObject.bounceCount >= 3 ? Math.max(0, ballObject.life) : 1;
        ctx.translate(ballObject.x, ballObject.y);
        ctx.rotate(ballObject.rotation);
        ctx.drawImage(ballObject.image, -ballObject.size / 2, -ballObject.size / 2, ballObject.size, ballObject.size);
        ctx.restore();
      }

      // Sports text content
      ctx.fillStyle = "white";
      ctx.textAlign = "left";
      ctx.font = "700 18px Arial";
      const message = sportsDay ? `${sportsDay.sport} Senior Night!` : "Sports Night overlay ready";
      const subtext = sportsDay ? "Go Hawks!" : "Add items to listOfSportsDays for today.";
      ctx.fillText(message, overlayX + 20, overlayY + 46);
      ctx.font = "14px Arial";
      ctx.fillText(subtext, overlayX + 20, overlayY + 74);
      if (sportsDay) {
        ctx.fillStyle = "rgba(255,255,255,0.75)";
        ctx.font = "12px Arial";
        ctx.fillText(`Date: ${sportsDay.day}`, overlayX + 20, overlayY + 98);
      }

      // Animated overlay glow ring
      const ringRadius = imageSize / 2 + 14 + Math.sin(bounce * 1.4) * 2;
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(imageX, imageY, ringRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Close button (X) in top right of overlay
      const closeButtonSize = 20;
      const closeButtonX = overlayX + overlayWidth - 18;
      const closeButtonY = overlayY + 12;
      ctx.save();
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.beginPath();
      ctx.arc(closeButtonX, closeButtonY, closeButtonSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      const offset = closeButtonSize / 4;
      ctx.beginPath();
      ctx.moveTo(closeButtonX - offset, closeButtonY - offset);
      ctx.lineTo(closeButtonX + offset, closeButtonY + offset);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(closeButtonX + offset, closeButtonY - offset);
      ctx.lineTo(closeButtonX - offset, closeButtonY + offset);
      ctx.stroke();
      ctx.restore();
    });

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  };
</script>

<WhimsyCanvas mode={mode} onLoad={setup} />
