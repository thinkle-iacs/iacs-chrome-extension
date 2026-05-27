<script lang="ts">
  import type {
    StartPage,
    WhimsyGameCanvas,
    WhimsyCanvasMode,
  } from "./whimsyCanvas";
  import WhimsyCanvas from "./WhimsyCanvas.svelte";

  export let mode: WhimsyCanvasMode = "absolute";

  let startPage: StartPage;

  type DrawParams = {
    ctx: CanvasRenderingContext2D;
    stepTime: number;
    timestamp: number;
    width: number;
    height: number;
  };

  /* Flower placement: place randomly while avoiding start-page targets and other flowers */
  type Flower = {
    x: number;
    y: number;
    scale: number;
    petalColor: string;
    centerColor: string;
    radius: number;
    depth: number;
    swayPhase?: number;
    swayAmp?: number;
    swayFreq?: number;
    bloomPhase?: number;
    bloomFreq?: number;
    swayEnabled?: boolean;
    bloomEnabled?: boolean;
    bloomAmp?: number;
    seeded?: boolean;
    growStart?: number;
    growDuration?: number;
    initialRadius?: number;
  };
  

  let flowers: Flower[] = [];
  let lastWidth = 0;
  let lastHeight = 0;

  function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
  }

  function rectIntersectsCircle(rect: { left: number; top: number; right: number; bottom: number }, x: number, y: number, r: number) {
    const nearestX = clamp(x, rect.left, rect.right);
    const nearestY = clamp(y, rect.top, rect.bottom);
    const dx = x - nearestX;
    const dy = y - nearestY;
    return dx * dx + dy * dy <= r * r;
  }

  function circlesOverlap(a: Flower, b: Flower) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dist2 = dx * dx + dy * dy;
    const minDist = a.radius + b.radius + 6; // small padding
    return dist2 < minDist * minDist;
  }

  function buildForbiddenRects() {
    const itemTypes = startPage.itemTypes;
    // Allow overlapping menu icons/menu items so links remain accessible (canvas is pointer-events:none).
    // Only avoid larger UI elements like cards and menus.
    const kinds = [itemTypes.CARD, itemTypes.MENU];

    const rects: { left: number; top: number; right: number; bottom: number }[] = [];
    for (const kind of kinds) {
      const items = startPage.getItems(kind);
      for (const it of items) {
        // expand target a bit to avoid flowers sitting flush
        const pad = 12;
        rects.push({
          left: it.rect.left - pad,
          top: it.rect.top - pad,
          right: it.rect.right + pad,
          bottom: it.rect.bottom + pad,
        });
      }
    }
    return rects;
  }

  function hsl(h: number, s: number, l: number) {
    return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
  }

  function pickRandomColorPair(i: number) {
    const baseHues = [340, 30, 70, 140, 200, 260];
    const hue = baseHues[i % baseHues.length] + (Math.random() - 0.5) * 16;
    const saturation = 68 + Math.random() * 14;
    const lightness = 74 + Math.random() * 10;
    const petalColor = hsl(hue, saturation, lightness);
    const centerColor = hsl(hue + 6, Math.max(55, saturation - 14), Math.max(52, lightness - 20));
    return [petalColor, centerColor];
  }

  function populateFlowers(width: number, height: number) {
    flowers = [];
    if (!startPage) return;

    const area = width * height;
    // Denser on large screens; cap to avoid overwhelming UI
    const count = Math.max(6, Math.min(32, Math.floor(area / (140 * 140))));
    const forbidden = buildForbiddenRects();

    for (let i = 0; i < count; i++) {
      const [petalColor, centerColor] = pickRandomColorPair(i);
      // wider scale variance for more diverse flower sizes
      const scale = 0.6 + Math.random() * 1.8; // ~0.6 - 2.4
      // give radius more randomness and scale it so larger flowers can appear
      const radius = (12 + Math.random() * 28) * scale;
      const depth = 0.75 + Math.random() * 0.4;

      // animation parameters
      const swayPhase = Math.random() * Math.PI * 2;
      const swayEnabled = Math.random() < 0.6; // ~60% of flowers sway
      // much subtler sway: tiny angular displacement to mimic a light breeze
      const swayAmp = swayEnabled ? (0.005 + Math.random() * 0.02) * (scale / 1.2) : 0; // radians
      const swayFreq = 0.2 + Math.random() * 0.6; // slower, gentler cycles
      const bloomPhase = Math.random() * Math.PI * 2;
      const bloomEnabled = Math.random() < 0.5; // ~50% of flowers pulse
      // much subtler bloom/pulse amplitude
      const bloomAmp = bloomEnabled ? (0.005 + Math.random() * 0.02) : 0;
      const bloomFreq = 0.2 + Math.random() * 0.6; // slower

      // seed/grow: ~25% spawn as a seed and grow over ~30s in waves
      const seeded = Math.random() < 0.25;
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const growDuration = seeded ? 30000 : 0; // 30 seconds
      const waveCount = 4;
      const waveIndex = seeded ? Math.floor(Math.random() * waveCount) : 0;
      const waveDelay = seeded ? waveIndex * (growDuration / waveCount) : 0;
      const growStart = seeded ? now + waveDelay + Math.random() * 1200 : 0;

      let placed = false;
      for (let attempt = 0; attempt < 200; attempt++) {
        const x = Math.round(radius + Math.random() * (Math.max(0, width - radius * 2)));
        const y = Math.round(radius + Math.random() * (Math.max(0, height - radius * 2)));

        // avoid forbidden rects
        let blocked = false;
        for (const r of forbidden) {
          if (rectIntersectsCircle(r, x, y, radius)) {
            blocked = true;
            break;
          }
        }
        if (blocked) continue;

        // avoid overlapping other flowers
        const f: Flower = {
          x,
          y,
          scale,
          petalColor,
          centerColor,
          radius,
          depth,
          swayPhase,
          swayAmp,
          swayFreq,
          bloomPhase,
          bloomFreq,
          swayEnabled,
          bloomEnabled,
          bloomAmp,
          seeded,
          growStart,
          growDuration,
          // start much smaller for seeded flowers (about 1% of final radius, at least 1px)
          initialRadius: seeded ? Math.max(1, Math.round(radius * 0.01)) : undefined,
        };
        let overlap = false;
        for (const other of flowers) {
          if (circlesOverlap(f, other)) {
            overlap = true;
            break;
          }
        }
        if (overlap) continue;

        flowers.push(f);
        placed = true;
        break;
      }

      if (!placed) {
        // give up on this flower if unable to place after many attempts
      }
    }

    // Draw far flowers first so deeper flowers stay behind nearer ones.
    flowers.sort((a, b) => a.depth - b.depth);
  }

  /*
   * Setup your game here. Add drawing functions to the provided
   * `WhimsyGameCanvas` via `gameCanvas.addDrawing(draw)`.
   */
  function draw({ ctx, width, height, timestamp }: DrawParams) {
    if (!startPage) return;

    if (width !== lastWidth || height !== lastHeight || flowers.length === 0) {
      lastWidth = width;
      lastHeight = height;
      populateFlowers(width, height);
    }

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    function drawFlowerAt(f: Flower) {
      ctx.save();
      ctx.translate(f.x, f.y);

      // animation values
      const nowMs = timestamp !== undefined && timestamp !== null ? timestamp : (typeof performance !== 'undefined' ? performance.now() : Date.now());
      const t = nowMs / 1000;
      const sway = (f.swayAmp || 0) * Math.sin(2 * Math.PI * (f.swayFreq || 0.5) * t + (f.swayPhase || 0));
      const bloomAmp = f.bloomAmp !== undefined ? f.bloomAmp : 0.01;
      const bloom = 1 + bloomAmp * Math.sin(2 * Math.PI * (f.bloomFreq || 0.5) * t + (f.bloomPhase || 0));

      // growth progress for seeded flowers (0..1)
      let currentRadius = f.radius;
      if (f.seeded && f.growStart && f.growDuration) {
        const progress = clamp((nowMs - f.growStart) / f.growDuration, 0, 1);
        // smoothstep easing
        const eased = progress * progress * (3 - 2 * progress);
        const startR = f.initialRadius || 2;
        currentRadius = startR + (f.radius - startR) * eased;
      }

      ctx.fillStyle = f.petalColor;
      const petalCount = 6;
      const petalOffset = currentRadius * 0.45 * bloom; // distance from center
      const petalW = Math.max(6, currentRadius * 0.35 * bloom);
      const petalH = Math.max(10, currentRadius * 0.9 * bloom);

      // apply a small sway rotation for the whole flower
      ctx.rotate(sway);

      for (let i = 0; i < petalCount; i++) {
        ctx.beginPath();
        ctx.rotate((Math.PI * 2) / petalCount);
        ctx.ellipse(0, petalOffset, petalW, petalH, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.beginPath();
      ctx.fillStyle = f.centerColor;
      const centerRadius = Math.max(4, Math.round(currentRadius * 0.45 * bloom));
      ctx.arc(0, 0, centerRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    for (const f of flowers) {
      drawFlowerAt(f);
    }

    ctx.restore();
  }

  function setupGame(gameCanvas: WhimsyGameCanvas, page: StartPage) {
    startPage = page;
    gameCanvas.addDrawing(draw);
  }

  function clearGame() {
    // Clear any state if you add interactivity
  }
</script>

<WhimsyCanvas {mode} onLoad={setupGame} onUnload={clearGame} />
