<script lang="ts">
  import WhimsyCanvas from "./WhimsyCanvas.svelte";
  import type {
    StartPage,
    StartPageItem,
    WhimsyCanvasSetup,
  } from "./whimsyCanvas";

  type Ball = {
    x: number;
    y: number;
    radius: number;
    vx: number;
    vy: number;
    speed: number;
  };

  type Paddle = {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  const BALL_RADIUS = 8;
  const STARTING_BALL_SPEED = 320;
  const SPEED_UP_EVERY = 6;
  const SPEED_UP_AMOUNT = 48;
  const MAX_BALL_SPEED = 620;
  const PADDLE_WIDTH = 120;
  const PADDLE_HEIGHT = 14;
  const PADDLE_BOTTOM_MARGIN = 28;
  const STARTING_LIVES = 3;
  const MAX_STEP_TIME = 32;
  const HEADER_HEIGHT = 48;
  const EXIT_SIZE = 24;
  const INTRO_MS = 1600;
  const LAUNCH_COUNTDOWN_MS = 3000;
  const HIGH_SCORES_KEY = "breakout-high-scores";
  const MAX_HIGH_SCORES = 10;

  export let onExit = () => {};

  let startPage: StartPage;
  let destroyedBricks: { [id: string]: boolean } = {};
  let score = 0;
  let lives = STARTING_LIVES;
  let level = 1;
  let gameOver = false;
  let ballIsLaunched = false;
  let launchCountdownStarted = 0;
  let canvasFontFamily = "sans-serif";

  type HighScore = { score: number; date: string };
  let highScores: HighScore[] = [];
  let topScore = 0;
  let scoreSaved = false;

  let ball: Ball = {
    x: 300,
    y: 300,
    radius: BALL_RADIUS,
    vx: STARTING_BALL_SPEED * 0.7,
    vy: -STARTING_BALL_SPEED,
    speed: STARTING_BALL_SPEED,
  };

  let paddle: Paddle = {
    x: 300,
    y: 500,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
  };

  function clamp(value: number, min: number, max: number) {
    if (value < min) {
      return min;
    }
    if (value > max) {
      return max;
    }
    return value;
  }

  function getBackgroundColor() {
    let main = document.querySelector("main");
    if (main) {
      let mainColor = window.getComputedStyle(main).backgroundColor;
      if (mainColor && mainColor !== "rgba(0, 0, 0, 0)") {
        return mainColor;
      }
    }

    let bodyColor = window.getComputedStyle(document.body).backgroundColor;
    if (bodyColor && bodyColor !== "rgba(0, 0, 0, 0)") {
      return bodyColor;
    }

    return (
      window.getComputedStyle(document.documentElement).backgroundColor ||
      "#ffffff"
    );
  }

  function getThemeFontFamily() {
    let bodyFont = window.getComputedStyle(document.body).fontFamily;

    if (bodyFont) {
      return bodyFont;
    }

    return "sans-serif";
  }

  function setCanvasFont(ctx: CanvasRenderingContext2D, size: number) {
    ctx.font = size + "px " + canvasFontFamily;
  }

  function loadHighScores() {
    try {
      let raw = localStorage.getItem(HIGH_SCORES_KEY);
      if (raw) {
        highScores = JSON.parse(raw);
        topScore = highScores.length > 0 ? highScores[0].score : 0;
      }
    } catch (e) {
      highScores = [];
      topScore = 0;
    }
  }

  function saveCurrentScore() {
    if (scoreSaved) return;
    scoreSaved = true;
    highScores.push({ score, date: new Date().toISOString() });
    highScores.sort((a, b) => b.score - a.score);
    if (highScores.length > MAX_HIGH_SCORES) {
      highScores = highScores.slice(0, MAX_HIGH_SCORES);
    }
    try {
      localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(highScores));
    } catch (e) {
      // ignore storage errors
    }
  }

  function formatScoreDate(isoString: string): string {
    let d = new Date(isoString);
    return (
      d.toLocaleDateString() +
      " " +
      d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  }

  function resetBall(width: number, launchCountdownStart: number) {
    ball.x = paddle.x + paddle.width / 2;
    ball.y = paddle.y - BALL_RADIUS - 2;
    ball.speed =
      STARTING_BALL_SPEED +
      (level - 1) * SPEED_UP_AMOUNT +
      Math.floor(score / SPEED_UP_EVERY) * SPEED_UP_AMOUNT;
    if (ball.speed > MAX_BALL_SPEED) {
      ball.speed = MAX_BALL_SPEED;
    }
    ball.vx = 0;
    ball.vy = 0;
    ballIsLaunched = false;
    launchCountdownStarted = launchCountdownStart;
  }

  function launchBall() {
    ball.vx = ball.speed * 0.45;
    ball.vy = -ball.speed;
    ballIsLaunched = true;
  }

  function setBallSpeed(speed: number) {
    let currentSpeed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
    if (currentSpeed <= 0) {
      return;
    }

    ball.speed = speed;
    ball.vx = (ball.vx / currentSpeed) * ball.speed;
    ball.vy = (ball.vy / currentSpeed) * ball.speed;
  }

  function getLiveBricks(height: number) {
    let bricks: StartPageItem[] = [];
    let menuItems = startPage.getItems(startPage.itemTypes.MENU_ITEM);

    for (let item of menuItems) {
      if (item.rect.top >= HEADER_HEIGHT && item.rect.top < height) {
        if (!destroyedBricks[item.id]) {
          bricks.push(item);
        }
      }
    }

    return bricks;
  }

  function getAllBricks(height: number) {
    let bricks: StartPageItem[] = [];
    let menuItems = startPage.getItems(startPage.itemTypes.MENU_ITEM);

    for (let item of menuItems) {
      if (item.rect.top >= HEADER_HEIGHT && item.rect.top < height) {
        bricks.push(item);
      }
    }

    return bricks;
  }

  function drawDestroyedBricks(ctx: CanvasRenderingContext2D, height: number) {
    let backgroundColor = getBackgroundColor();
    let menuItems = startPage.getItems(startPage.itemTypes.MENU_ITEM);

    ctx.save();
    ctx.fillStyle = backgroundColor;

    for (let item of menuItems) {
      if (
        destroyedBricks[item.id] &&
        item.rect.top >= HEADER_HEIGHT &&
        item.rect.top < height
      ) {
        ctx.fillRect(
          item.rect.left - 4,
          item.rect.top - 4,
          item.rect.width + 8,
          item.rect.height + 8,
        );
      }
    }

    ctx.restore();
  }

  function drawPaddle(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = "#c6093b";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    ctx.fillRect(paddle.x + 4, paddle.y + 3, paddle.width - 8, 3);
    ctx.restore();
  }

  function drawBall(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "#0033a0";
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawHeader(ctx: CanvasRenderingContext2D, width: number) {
    ctx.save();

    ctx.fillStyle = "rgba(0, 51, 160, 0.96)";
    ctx.fillRect(0, 0, width, HEADER_HEIGHT);

    ctx.strokeStyle = "#c6093b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, HEADER_HEIGHT);
    ctx.lineTo(width, HEADER_HEIGHT);
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    setCanvasFont(ctx, 18);
    ctx.fillText("[ x ]", 16, 30);

    ctx.textAlign = "center";
    setCanvasFont(ctx, 22);
    ctx.fillText("IACS BREAKOUT", width / 2, 31);

    ctx.textAlign = "right";
    setCanvasFont(ctx, 16);
    let isHighScore =
      score > 0 && (highScores.length === 0 || score >= topScore);
    ctx.fillText(
      "Level: " + level + "   Lives: " + lives + "   Score: " + score + (isHighScore ? " 👑" : ""),
      width - 16,
      30,
    );

    ctx.restore();
  }

  function drawLeaderboard(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
  ) {
    let shown = highScores.slice(0, 8);
    if (shown.length === 0) return;

    let rowHeight = 22;
    let padding = 14;
    let titleHeight = 34;
    let boxWidth = Math.min(360, width - 40);
    let boxHeight = titleHeight + shown.length * rowHeight + padding * 2;
    let boxX = (width - boxWidth) / 2;
    let boxY = height / 2 + 24;

    ctx.save();
    ctx.fillStyle = "rgba(0, 20, 80, 0.92)";
    ctx.strokeStyle = "#c6093b";
    ctx.lineWidth = 2;
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    setCanvasFont(ctx, 17);
    ctx.fillText("\uD83C\uDFC6 HIGH SCORES", width / 2, boxY + titleHeight - 6);

    setCanvasFont(ctx, 14);
    for (let i = 0; i < shown.length; i++) {
      let y = boxY + titleHeight + padding + i * rowHeight;
      let s = shown[i];
      ctx.textAlign = "left";
      ctx.fillText((i + 1) + ". " + s.score, boxX + padding, y);
      ctx.textAlign = "right";
      ctx.fillText(formatScoreDate(s.date), boxX + boxWidth - padding, y);
    }

    ctx.restore();
  }

  function drawMessage(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    elapsed: number,
  ) {
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "rgba(0, 0, 0, 0.65)";
    ctx.lineWidth = 4;
    ctx.textAlign = "center";

    let message = "";
    if (elapsed < INTRO_MS) {
      message = "Breakout...";
    }
    if (gameOver) {
      message = "Game over.";
    }
    if (!gameOver && elapsed >= INTRO_MS && !ballIsLaunched) {
      let countdownLeft =
        LAUNCH_COUNTDOWN_MS - (elapsed - launchCountdownStarted);
      let countdownNumber = Math.ceil(countdownLeft / 1000);

      if (countdownNumber < 1) {
        countdownNumber = 1;
      }

      message = countdownNumber.toString();
    }

    if (message) {
      setCanvasFont(ctx, 42);
      ctx.strokeText(message, width / 2, height / 2);
      ctx.fillText(message, width / 2, height / 2);
    }

    ctx.restore();
  }

  function clickIsOnExit(event: MouseEvent) {
    if (event.clientX < 14) {
      return false;
    }
    if (event.clientX > 14 + EXIT_SIZE * 2) {
      return false;
    }
    if (event.clientY < 8) {
      return false;
    }
    if (event.clientY > 8 + EXIT_SIZE) {
      return false;
    }

    return true;
  }

  function handleWindowMouseDown(event: MouseEvent) {
    if (clickIsOnExit(event)) {
      onExit();
    }
  }

  function circleTouchesRect(rect: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  }) {
    let nearestX = clamp(ball.x, rect.left, rect.right);
    let nearestY = clamp(ball.y, rect.top, rect.bottom);
    let dx = ball.x - nearestX;
    let dy = ball.y - nearestY;
    return dx * dx + dy * dy <= ball.radius * ball.radius;
  }

  function bounceOffRect(
    rect: {
      left: number;
      right: number;
      top: number;
      bottom: number;
    },
    previousX: number,
    previousY: number,
  ) {
    let expandedLeft = rect.left - ball.radius;
    let expandedRight = rect.right + ball.radius;
    let expandedTop = rect.top - ball.radius;
    let expandedBottom = rect.bottom + ball.radius;

    if (previousY <= expandedTop) {
      ball.y = expandedTop;
      ball.vy = -Math.abs(ball.vy);
      return;
    }

    if (previousY >= expandedBottom) {
      ball.y = expandedBottom;
      ball.vy = Math.abs(ball.vy);
      return;
    }

    if (previousX <= expandedLeft) {
      ball.x = expandedLeft;
      ball.vx = -Math.abs(ball.vx);
      return;
    }

    if (previousX >= expandedRight) {
      ball.x = expandedRight;
      ball.vx = Math.abs(ball.vx);
      return;
    }

    let distanceLeft = Math.abs(ball.x - expandedLeft);
    let distanceRight = Math.abs(expandedRight - ball.x);
    let distanceTop = Math.abs(ball.y - expandedTop);
    let distanceBottom = Math.abs(expandedBottom - ball.y);
    let smallest = distanceLeft;
    let side = "left";

    if (distanceRight < smallest) {
      smallest = distanceRight;
      side = "right";
    }
    if (distanceTop < smallest) {
      smallest = distanceTop;
      side = "top";
    }
    if (distanceBottom < smallest) {
      side = "bottom";
    }

    if (side === "left") {
      ball.x = expandedLeft;
      ball.vx = -Math.abs(ball.vx);
    } else if (side === "right") {
      ball.x = expandedRight;
      ball.vx = Math.abs(ball.vx);
    } else if (side === "top") {
      ball.y = expandedTop;
      ball.vy = -Math.abs(ball.vy);
    } else {
      ball.y = expandedBottom;
      ball.vy = Math.abs(ball.vy);
    }
  }

  function updatePaddle(width: number) {
    let targetX = startPage.mouse.x - paddle.width / 2;
    paddle.x = clamp(targetX, 0, width - paddle.width);
  }

  function updateBall(
    seconds: number,
    width: number,
    height: number,
    elapsed: number,
  ) {
    if (!ballIsLaunched) {
      ball.x = paddle.x + paddle.width / 2;
      ball.y = paddle.y - ball.radius - 2;

      if (elapsed - launchCountdownStarted >= LAUNCH_COUNTDOWN_MS) {
        launchBall();
      } else {
        return;
      }
    }

    let previousX = ball.x;
    let previousY = ball.y;

    ball.x += ball.vx * seconds;
    ball.y += ball.vy * seconds;

    if (ball.x - ball.radius < 0) {
      ball.x = ball.radius;
      ball.vx = Math.abs(ball.vx);
    }
    if (ball.x + ball.radius > width) {
      ball.x = width - ball.radius;
      ball.vx = -Math.abs(ball.vx);
    }
    if (ball.y - ball.radius < HEADER_HEIGHT) {
      ball.y = HEADER_HEIGHT + ball.radius;
      ball.vy = Math.abs(ball.vy);
    }

    let paddleRect = {
      left: paddle.x,
      right: paddle.x + paddle.width,
      top: paddle.y,
      bottom: paddle.y + paddle.height,
    };

    if (ball.vy > 0 && circleTouchesRect(paddleRect)) {
      let paddleCenter = paddle.x + paddle.width / 2;
      let offset = (ball.x - paddleCenter) / (paddle.width / 2);
      ball.y = paddle.y - ball.radius;
      ball.vx = offset * ball.speed;
      ball.vy = -Math.abs(ball.speed * 0.9);
      setBallSpeed(ball.speed);
    }

    let bricks = getLiveBricks(height);

    for (let brick of bricks) {
      let rect = brick.rect;
      if (circleTouchesRect(rect)) {
        destroyedBricks[brick.id] = true;
        score += 1;

        if (score % SPEED_UP_EVERY === 0) {
          let nextSpeed = ball.speed + SPEED_UP_AMOUNT;
          if (nextSpeed > MAX_BALL_SPEED) {
            nextSpeed = MAX_BALL_SPEED;
          }
          setBallSpeed(nextSpeed);
        }

        bounceOffRect(rect, previousX, previousY);
        break;
      }
    }

    if (ball.y - ball.radius > height) {
      lives -= 1;
      if (lives <= 0) {
        gameOver = true;
        saveCurrentScore();
      } else {
        resetBall(width, elapsed);
      }
    }

    let remainingBricks = getLiveBricks(height);
    let allBricks = getAllBricks(height);
    if (remainingBricks.length === 0 && allBricks.length > 0) {
      level += 1;
      destroyedBricks = {};
      resetBall(width, elapsed);
    }
  }

  const setupGame: WhimsyCanvasSetup = (gameCanvas, page) => {
    startPage = page;
    canvasFontFamily = getThemeFontFamily();
    loadHighScores();

    gameCanvas.addDrawing(({ ctx, width, height, elapsed, stepTime }) => {
      let seconds = Math.min(stepTime || 16, MAX_STEP_TIME) / 1000;

      paddle.y = height - PADDLE_BOTTOM_MARGIN - paddle.height;

      if (launchCountdownStarted === 0) {
        resetBall(width, INTRO_MS);
      }

      drawDestroyedBricks(ctx, height);
      drawHeader(ctx, width);

      if (!gameOver) {
        updatePaddle(width);
        if (elapsed >= INTRO_MS) {
          updateBall(seconds, width, height, elapsed);
        } else {
          ball.x = paddle.x + paddle.width / 2;
          ball.y = paddle.y - ball.radius - 2;
        }
      }

      drawPaddle(ctx);
      drawBall(ctx);
      drawMessage(ctx, width, height, elapsed);
      if (gameOver) {
        drawLeaderboard(ctx, width, height);
      }
    });

    window.addEventListener("mousedown", handleWindowMouseDown);

    return () => {
      window.removeEventListener("mousedown", handleWindowMouseDown);
    };
  };
</script>

<WhimsyCanvas mode="fixed" onLoad={setupGame} />
