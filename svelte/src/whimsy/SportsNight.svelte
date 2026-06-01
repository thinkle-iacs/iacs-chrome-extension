<script lang="ts">
  import type { WhimsyCanvasMode, WhimsyCanvasSetup } from "./whimsyCanvas";
  import WhimsyCanvas from "./WhimsyCanvas.svelte";

  type SportsDayEntry = {
    day: string; // ISO date string: YYYY-MM-DD
    sport: string;
  };

  const listOfSportsDays: SportsDayEntry[] = [
    // Add sports days here with exact dates and sport names.
    { day: "2026-05-29", sport: "Volleyball" },
    { day: "2026-06-01", sport: "Basketball" },
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
    const hawkImage = new Image();
    hawkImage.src = "/hawk.png";

    const sportKey = sportsDay ? sportsDay.sport.toLowerCase() : "";
    const sportBallUrl = sportKey.includes("volley")
      ? "/volleyball.png"
      : sportKey.includes("basket")
      ? "/basketball.png"
      : sportKey.includes("soccer")
      ? "/soccerball.png"
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
      bounced: boolean;
      life: number;
      image: HTMLImageElement;
    } | null = null;

    gameCanvas.addDrawing(({ ctx, width, height, stepTime }) => {
      const elapsed = Math.min(stepTime || 16, 100);
      angle += (elapsed / 1000) * 0.7;
      bounce += (elapsed / 1000) * 0.9;

      const overlayWidth = Math.min(420, width * 0.42);
      const overlayHeight = 140;
      const overlayX = 24;
      const overlayY = height - overlayHeight - 24 + Math.sin(angle * 1.2) * 4;
      const imageSize = 92;
      const imageX = overlayX + overlayWidth - 110;
      const imageY = overlayY + overlayHeight / 2;
      const overlayColor = "#0033a0";

      if (!ballObject && !ballSpawned && ballImage) {
        ballSpawned = true;
        ballObject = {
          x: -42,
          y: overlayY - 72,
          vx: 260,
          vy: 220,
          size: 44,
          rotation: 0,
          vr: 5.5,
          bounced: false,
          life: 1,
          image: ballImage,
        };
      }

      if (ballObject) {
        ballObject.x += (ballObject.vx * elapsed) / 1000;
        ballObject.y += (ballObject.vy * elapsed) / 1000;
        ballObject.rotation += (ballObject.vr * elapsed) / 1000;
        ballObject.vy += 760 * (elapsed / 1000);

        const overlayTop = overlayY;
        const overlayLeft = overlayX;
        const overlayRight = overlayX + overlayWidth;
        const ballBottom = ballObject.y + ballObject.size / 2;

        if (
          !ballObject.bounced &&
          ballObject.vy > 0 &&
          ballBottom >= overlayTop &&
          ballObject.x + ballObject.size / 2 > overlayLeft &&
          ballObject.x - ballObject.size / 2 < overlayRight
        ) {
          ballObject.y = overlayTop - ballObject.size / 2;
          ballObject.vy = -Math.abs(ballObject.vy) * 0.5;
          ballObject.vx *= 0.8;
          ballObject.bounced = true;
        }

        if (ballObject.bounced) {
          ballObject.life -= elapsed / 1000;
          if (ballObject.life <= 0 || ballObject.x - ballObject.size > width || ballObject.y + ballObject.size < 0) {
            ballObject = null;
          }
        }
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
        ctx.globalAlpha = ballObject.bounced ? Math.max(0, ballObject.life) : 1;
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
