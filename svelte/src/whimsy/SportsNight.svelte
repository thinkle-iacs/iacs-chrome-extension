<script lang="ts">
  import type { WhimsyCanvasMode, WhimsyCanvasSetup } from "./whimsyCanvas";
  import WhimsyCanvas from "./WhimsyCanvas.svelte";

  type SportsDayEntry = {
    day: string; // ISO date string: YYYY-MM-DD
    sport: string;
  };

  const listOfSportsDays: SportsDayEntry[] = [
    // Add sports days here with exact dates and sport names.
    { day: "2026-05-28", sport: "Volleyball" },
    // { day: "2026-06-12", sport: "Senior Night Soccer" },
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

  const setup: WhimsyCanvasSetup = (gameCanvas) => {
    const imageUrl = "hawk.png"; 
    let image: HTMLImageElement | null = null;
    let angle = 0;
    let bounce = 0;
    let sportObjects: { x: number; y: number; vx: number; vy: number; size: number }[] = [];

    if (imageUrl) {
      image = new Image();
      image.src = imageUrl;
    }

    const sportSpriteMapping: Record<string, { draw: (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) => void }> = {
      volleyball: {
        draw(ctx, x, y, size, rotation) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(rotation);
          ctx.fillStyle = "#fafafa";
          ctx.beginPath();
          ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#0033a0";
          ctx.lineWidth = Math.max(2, size * 0.08);
          ctx.beginPath();
          ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(-size * 0.32, -size * 0.45);
          ctx.quadraticCurveTo(-size * 0.12, 0, -size * 0.32, size * 0.45);
          ctx.moveTo(size * 0.32, -size * 0.45);
          ctx.quadraticCurveTo(size * 0.12, 0, size * 0.32, size * 0.45);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(-size * 0.46, -size * 0.12);
          ctx.quadraticCurveTo(0, 0, size * 0.46, -size * 0.12);
          ctx.stroke();
          ctx.restore();
        },
      },
      soccer: {
        draw(ctx, x, y, size, rotation) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(rotation);
          ctx.fillStyle = "white";
          ctx.beginPath();
          ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#333";
          ctx.lineWidth = Math.max(2, size * 0.05);
          ctx.stroke();
          ctx.fillStyle = "#333";
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const cx = Math.cos(angle) * size * 0.18;
            const cy = Math.sin(angle) * size * 0.18;
            ctx.beginPath();
            ctx.arc(cx, cy, size * 0.08, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        },
      },
      basketball: {
        draw(ctx, x, y, size, rotation) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(rotation);
          ctx.fillStyle = "#f59f24";
          ctx.beginPath();
          ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#4c2b0f";
          ctx.lineWidth = Math.max(2, size * 0.07);
          ctx.beginPath();
          ctx.arc(0, 0, size / 2 * 0.9, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, -size * 0.45);
          ctx.lineTo(0, size * 0.45);
          ctx.moveTo(-size * 0.45, 0);
          ctx.lineTo(size * 0.45, 0);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(-size * 0.32, -size * 0.32);
          ctx.quadraticCurveTo(0, 0, -size * 0.32, size * 0.32);
          ctx.moveTo(size * 0.32, -size * 0.32);
          ctx.quadraticCurveTo(0, 0, size * 0.32, size * 0.32);
          ctx.stroke();
          ctx.restore();
        },
      },
      crosscountry: {
        draw(ctx, x, y, size, rotation) {
          // simple running figure silhouette
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(rotation * 0.6);
          ctx.fillStyle = "white";
          // body
          ctx.fillRect(-size * 0.06, -size * 0.18, size * 0.12, size * 0.36);
          // head
          ctx.beginPath();
          ctx.arc(0, -size * 0.32, size * 0.09, 0, Math.PI * 2);
          ctx.fill();
          // legs (two simple lines)
          ctx.strokeStyle = "rgba(255,255,255,0.95)";
          ctx.lineWidth = Math.max(2, size * 0.06);
          ctx.beginPath();
          ctx.moveTo(-size * 0.02, size * 0.18);
          ctx.lineTo(-size * 0.18, size * 0.36);
          ctx.moveTo(size * 0.02, size * 0.18);
          ctx.lineTo(size * 0.18, size * 0.36);
          ctx.stroke();
          ctx.restore();
        },
      },
      track: {
        draw(ctx, x, y, size, rotation) {
          // stopwatch-like circle with ticks to suggest track/meet
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(rotation * 0.4);
          ctx.fillStyle = "#fff";
          ctx.beginPath();
          ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#0033a0";
          ctx.lineWidth = Math.max(2, size * 0.05);
          ctx.stroke();
          // ticks
          for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2;
            const sx = Math.cos(a) * (size * 0.4);
            const sy = Math.sin(a) * (size * 0.4);
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx * 0.85, sy * 0.85);
            ctx.stroke();
          }
          ctx.restore();
        },
      },
      indoortrack: {
        draw(ctx, x, y, size, rotation) {
          // similar to track but with a small inner oval
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(-rotation * 0.35);
          ctx.fillStyle = "#fff";
          ctx.beginPath();
          ctx.ellipse(0, 0, size * 0.5, size * 0.32, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#0033a0";
          ctx.lineWidth = Math.max(2, size * 0.05);
          ctx.stroke();
          ctx.strokeStyle = "rgba(0,0,0,0.15)";
          ctx.beginPath();
          ctx.ellipse(0, 0, size * 0.3, size * 0.18, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        },
      },
      generic: {
        draw(ctx, x, y, size, rotation) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(rotation);
          ctx.fillStyle = "white";
          ctx.beginPath();
          ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#0033a0";
          ctx.lineWidth = Math.max(2, size * 0.06);
          ctx.stroke();
          ctx.restore();
        },
      },
    };

    function getSpriteKind(sport: string) {
      const normalized = sport.toLowerCase();
      if (normalized.includes("volley")) return "volleyball";
      if (normalized.includes("basket")) return "basketball";
      if (normalized.includes("soccer")) return "soccer";
      if (normalized.includes("cross")) return "crosscountry";
      if (normalized.includes("indoor")) return "indoortrack";
      if (normalized.includes("track")) return "track";
      return "generic";
    }

    const spriteKind = getSpriteKind(sportsDay ? sportsDay.sport : "");
    const sprite = sportSpriteMapping[spriteKind];

    gameCanvas.addDrawing(({ ctx, width, height, stepTime }) => {
      const elapsed = Math.min(stepTime || 16, 100);
      angle += (elapsed / 1000) * 0.7;
      bounce += (elapsed / 1000) * 0.9;

      const overlayWidth = Math.min(420, width * 0.42);
      const overlayHeight = 140;
      const overlayX = 24;
      const overlayY = height - overlayHeight - 24 + Math.sin(angle * 1.2) * 4;
      const imageSize = 92;
      const imageX = overlayX + overlayWidth - 48;
      const imageY = overlayY + overlayHeight / 2;
      const overlayColor = "#0033a0";

      if (sportObjects.length === 0) {
        sportObjects = [
          {
            x: overlayX + 82,
            y: overlayY + 46,
            vx: 70,
            vy: 32,
            size: 28,
          },
          {
            x: overlayX + 146,
            y: overlayY + 94,
            vx: 48,
            vy: -48,
            size: 22,
          },
        ];
      }

      sportObjects.forEach((object) => {
        object.x += (object.vx * elapsed) / 1000;
        object.y += (object.vy * elapsed) / 1000;
        if (object.x < overlayX + 60 || object.x > overlayX + overlayWidth - 92) {
          object.vx *= -1;
        }
        if (object.y < overlayY + 46 || object.y > overlayY + overlayHeight - 46) {
          object.vy *= -1;
        }
      });

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

      if (image && image.complete && image.naturalWidth > 0) {
        ctx.save();
        ctx.globalAlpha = 0.65;
        ctx.drawImage(image, imageX - imageSize / 2, imageY - imageSize / 2, imageSize, imageSize);
        ctx.restore();
      }

      // Sport objects animation inside the panel
      sportObjects.forEach((object) => {
        sprite.draw(ctx, object.x, object.y, object.size, angle * 2);
      });

      // Sports text content
      ctx.fillStyle = "white";
      ctx.textAlign = "left";
      ctx.font = "700 18px Arial";
      const message = sportsDay ? `${sportsDay.sport} senior night!` : "Sports Night overlay ready";
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
      const ringRadius = imageSize / 2 + 8 + Math.sin(bounce * 1.4) * 2;
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(imageX, imageY, ringRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });

    return () => {
      // Add cleanup logic here if needed.
    };
  };
</script>

<WhimsyCanvas mode={mode} onLoad={setup} />
