export type WhimsyCanvasMode = "fixed" | "absolute";

export type WhimsyRect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
};

export type WhimsyTarget = {
  id: string;
  kind: string;
  element: HTMLElement;
  rect: WhimsyRect;
  fixedRect: WhimsyRect;
  absoluteRect: WhimsyRect;
  dataset: Record<string, string>;
};

export type WhimsyTargetSource = {
  kind: string;
  selector?: string;
  resolveElements?: () => Iterable<HTMLElement>;
  getId?: (element: HTMLElement, index: number) => string;
};

export type WhimsyFrame = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  clear: () => void;
  elapsed: number;
  getTargets: (kind?: string, mode?: WhimsyCanvasMode) => WhimsyTarget[];
  height: number;
  mode: WhimsyCanvasMode;
  now: number;
  pixelRatio: number;
  targets: WhimsyTarget[];
  width: number;
};

export type WhimsyCanvasOptions = {
  autoTrackDefaultTargets?: boolean;
  maxFps?: number;
  mode?: WhimsyCanvasMode;
  targetSources?: WhimsyTargetSource[];
  useDevicePixelRatio?: boolean;
  zIndex?: number;
};

export type WhimsyCanvasController = {
  attach: (canvas: HTMLCanvasElement) => void;
  destroy: () => void;
  getCanvasSize: () => { width: number; height: number };
  getMode: () => WhimsyCanvasMode;
  getTargets: (kind?: string, mode?: WhimsyCanvasMode) => WhimsyTarget[];
  measureElement: (
    element: HTMLElement,
    kind?: string,
    id?: string,
    mode?: WhimsyCanvasMode
  ) => WhimsyTarget | null;
  refresh: () => void;
  registerTargetSource: (source: WhimsyTargetSource) => () => void;
  setMode: (mode: WhimsyCanvasMode) => void;
  start: (render: (frame: WhimsyFrame) => void) => void;
  stop: () => void;
};

type InternalTarget = {
  id: string;
  kind: string;
  element: HTMLElement;
  fixedRect: WhimsyRect;
  absoluteRect: WhimsyRect;
  dataset: Record<string, string>;
};

const DEFAULT_TARGET_SOURCES: WhimsyTargetSource[] = [
  {
    kind: "card",
    selector: '[data-whimsy-kind="card"]',
  },
  {
    kind: "menu",
    selector: '[data-whimsy-kind="menu"]',
  },
  {
    kind: "menu-item",
    selector: '[data-whimsy-kind="menu-item"]',
  },
  {
    kind: "menu-icon",
    selector: '[data-whimsy-kind="menu-icon"]',
  },
];

function toRect(bounds: DOMRectReadOnly | DOMRect): WhimsyRect {
  return {
    left: bounds.left,
    top: bounds.top,
    right: bounds.right,
    bottom: bounds.bottom,
    width: bounds.width,
    height: bounds.height,
    centerX: bounds.left + bounds.width / 2,
    centerY: bounds.top + bounds.height / 2,
  };
}

function shiftRect(rect: WhimsyRect, deltaX: number, deltaY: number): WhimsyRect {
  return {
    left: rect.left + deltaX,
    top: rect.top + deltaY,
    right: rect.right + deltaX,
    bottom: rect.bottom + deltaY,
    width: rect.width,
    height: rect.height,
    centerX: rect.centerX + deltaX,
    centerY: rect.centerY + deltaY,
  };
}

function normalizeDataset(dataset: DOMStringMap): Record<string, string> {
  return Object.entries(dataset).reduce((record, [key, value]) => {
    if (value != null) {
      record[key] = value;
    }
    return record;
  }, {} as Record<string, string>);
}

function getDocumentSize() {
  const body = document.body;
  const root = document.documentElement;
  const main = document.querySelector("main");
  const mainBounds = main ? main.getBoundingClientRect() : null;
  const mainBottom = mainBounds ? Math.ceil(mainBounds.bottom + window.scrollY) : 0;
  const viewportWidth = Math.max(
    root.clientWidth,
    body?.clientWidth || 0,
    mainBounds ? Math.ceil(mainBounds.width) : 0
  );

  return {
    width: viewportWidth,
    height: Math.max(
      window.innerHeight,
      root.clientHeight,
      root.scrollHeight,
      body?.scrollHeight || 0,
      mainBottom
    ),
  };
}

function measureTarget(
  element: HTMLElement,
  kind: string,
  id: string,
  mode: WhimsyCanvasMode
): WhimsyTarget | null {
  const bounds = element.getBoundingClientRect();
  if (!bounds.width || !bounds.height) {
    return null;
  }

  const fixedRect = toRect(bounds);
  const absoluteRect = shiftRect(fixedRect, window.scrollX, window.scrollY);

  return {
    id,
    kind,
    element,
    rect: mode === "fixed" ? fixedRect : absoluteRect,
    fixedRect,
    absoluteRect,
    dataset: normalizeDataset(element.dataset),
  };
}

export function createWhimsyCanvas(
  options: WhimsyCanvasOptions = {}
): WhimsyCanvasController {
  const targetSources: WhimsyTargetSource[] = [
    ...(options.autoTrackDefaultTargets === false ? [] : DEFAULT_TARGET_SOURCES),
    ...(options.targetSources || []),
  ];

  const maxFps = options.maxFps || 30;
  const minFrameLength = 1000 / maxFps;
  const useDevicePixelRatio = options.useDevicePixelRatio !== false;
  const zIndex = options.zIndex || 999999;

  let mode: WhimsyCanvasMode = options.mode || "absolute";
  let canvas: HTMLCanvasElement | null = null;
  let ctx: CanvasRenderingContext2D | null = null;
  let width = 0;
  let height = 0;
  let pixelRatio = Math.max(1, window.devicePixelRatio || 1);
  let targets: InternalTarget[] = [];
  let destroyed = false;
  let running = false;
  let rafId = 0;
  let refreshScheduled = false;
  let lastRender = 0;
  let renderCallback: ((frame: WhimsyFrame) => void) | null = null;
  let lastViewportWidth = 0;
  let lastViewportHeight = 0;
  let lastScrollX = 0;
  let lastScrollY = 0;

  const resizeObserver =
    typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(() => {
          scheduleRefresh();
        });

  const mutationObserver =
    typeof MutationObserver === "undefined"
      ? null
      : new MutationObserver(() => {
          scheduleRefresh();
        });

  function resolveId(source: WhimsyTargetSource, element: HTMLElement, index: number) {
    if (source.getId) {
      return source.getId(element, index);
    }
    return (
      element.dataset.whimsyId ||
      element.id ||
      `${source.kind}-${element.dataset.whimsyTitle || index}`
    );
  }

  function collectTargets() {
    const nextTargets: InternalTarget[] = [];

    targetSources.forEach((source) => {
      const sourceElements = source.resolveElements
        ? Array.from(source.resolveElements())
        : Array.from(
            document.querySelectorAll<HTMLElement>(source.selector || "")
          );

      sourceElements.forEach((element, index) => {
        const measured = measureTarget(
          element,
          source.kind,
          resolveId(source, element, index),
          mode
        );

        if (!measured) {
          return;
        }

        nextTargets.push({
          id: measured.id,
          kind: measured.kind,
          element: measured.element,
          fixedRect: measured.fixedRect,
          absoluteRect: measured.absoluteRect,
          dataset: measured.dataset,
        });
      });
    });

    targets = nextTargets;
  }

  function getViewportSnapshot() {
    return {
      width:
        mode === "fixed"
          ? document.documentElement.clientWidth
          : getDocumentSize().width,
      height:
        mode === "fixed" ? window.innerHeight : getDocumentSize().height,
      scrollX: window.scrollX,
      scrollY: window.scrollY,
    };
  }

  function syncViewportSnapshot() {
    const snapshot = getViewportSnapshot();
    lastViewportWidth = snapshot.width;
    lastViewportHeight = snapshot.height;
    lastScrollX = snapshot.scrollX;
    lastScrollY = snapshot.scrollY;
  }

  function viewportChanged() {
    const snapshot = getViewportSnapshot();
    return (
      snapshot.width !== lastViewportWidth ||
      snapshot.height !== lastViewportHeight ||
      snapshot.scrollX !== lastScrollX ||
      snapshot.scrollY !== lastScrollY
    );
  }

  function updateCanvasElement() {
    if (!canvas || !ctx) {
      return;
    }

    pixelRatio = useDevicePixelRatio
      ? Math.max(1, window.devicePixelRatio || 1)
      : 1;

    const nextSize =
      mode === "fixed"
        ? {
            width: document.documentElement.clientWidth,
            height: window.innerHeight,
          }
        : getDocumentSize();

    width = nextSize.width;
    height = nextSize.height;

    canvas.style.pointerEvents = "none";
    canvas.style.position = mode === "fixed" ? "fixed" : "absolute";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.style.zIndex = `${zIndex}`;
    canvas.style.display = "block";
    canvas.setAttribute("aria-hidden", "true");

    const scaledWidth = Math.max(1, Math.round(width * pixelRatio));
    const scaledHeight = Math.max(1, Math.round(height * pixelRatio));

    if (canvas.width !== scaledWidth) {
      canvas.width = scaledWidth;
    }
    if (canvas.height !== scaledHeight) {
      canvas.height = scaledHeight;
    }

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    syncViewportSnapshot();
  }

  function clearCanvas() {
    if (!ctx) {
      return;
    }
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.clearRect(0, 0, width, height);
  }

  function refresh() {
    if (destroyed) {
      return;
    }
    updateCanvasElement();
    collectTargets();
  }

  function scheduleRefresh() {
    if (destroyed || refreshScheduled) {
      return;
    }

    refreshScheduled = true;
    window.requestAnimationFrame(() => {
      refreshScheduled = false;
      refresh();
    });
  }

  function getTargets(kind?: string, targetMode: WhimsyCanvasMode = mode) {
    return targets
      .filter((target) => !kind || target.kind === kind)
      .map((target) => ({
        ...target,
        rect: targetMode === "fixed" ? target.fixedRect : target.absoluteRect,
      }));
  }

  function animate(now: number) {
    if (!running || !canvas || !ctx || !renderCallback) {
      return;
    }

    rafId = window.requestAnimationFrame(animate);

    if (viewportChanged()) {
      refresh();
    }

    if (document.hidden) {
      lastRender = now;
      return;
    }

    if (lastRender && now - lastRender < minFrameLength) {
      return;
    }

    const elapsed = lastRender ? now - lastRender : 0;
    lastRender = now;

    renderCallback({
      canvas,
      ctx,
      clear: clearCanvas,
      elapsed,
      getTargets,
      height,
      mode,
      now,
      pixelRatio,
      targets: getTargets(),
      width,
    });
  }

  function attach(nextCanvas: HTMLCanvasElement) {
    canvas = nextCanvas;
    ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Unable to create whimsy canvas context");
    }

    refresh();

    window.addEventListener("resize", scheduleRefresh);
    window.addEventListener("scroll", scheduleRefresh, true);
    window.visualViewport?.addEventListener("resize", scheduleRefresh);
    window.visualViewport?.addEventListener("scroll", scheduleRefresh);

    if (resizeObserver) {
      resizeObserver.observe(document.body);
      const main = document.querySelector("main");
      if (main) {
        resizeObserver.observe(main);
      }
    }

    if (mutationObserver) {
      mutationObserver.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["class", "style", "hidden", "open", "data-whimsy-kind"],
      });
    }
  }

  function start(render: (frame: WhimsyFrame) => void) {
    renderCallback = render;
    running = true;
    lastRender = 0;
    refresh();
    if (!rafId) {
      rafId = window.requestAnimationFrame(animate);
    }
  }

  function stop() {
    running = false;
    renderCallback = null;
    lastRender = 0;
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  function registerTargetSource(source: WhimsyTargetSource) {
    targetSources.push(source);
    scheduleRefresh();

    return () => {
      const index = targetSources.indexOf(source);
      if (index >= 0) {
        targetSources.splice(index, 1);
        scheduleRefresh();
      }
    };
  }

  function setMode(nextMode: WhimsyCanvasMode) {
    mode = nextMode;
    refresh();
  }

  function destroy() {
    if (destroyed) {
      return;
    }

    destroyed = true;
    stop();
    resizeObserver?.disconnect();
    mutationObserver?.disconnect();
    window.removeEventListener("resize", scheduleRefresh);
    window.removeEventListener("scroll", scheduleRefresh, true);
    window.visualViewport?.removeEventListener("resize", scheduleRefresh);
    window.visualViewport?.removeEventListener("scroll", scheduleRefresh);
    clearCanvas();
    canvas = null;
    ctx = null;
    targets = [];
  }

  return {
    attach,
    destroy,
    getCanvasSize: () => ({ width, height }),
    getMode: () => mode,
    getTargets,
    measureElement: (
      element: HTMLElement,
      kind = "custom",
      id = element.dataset.whimsyId || element.id || kind,
      targetMode = mode
    ) => measureTarget(element, kind, id, targetMode),
    refresh,
    registerTargetSource,
    setMode,
    start,
    stop,
  };
}
