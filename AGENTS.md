# AGENTS.md

This repo began life as a Chrome extension, but the useful product is now the Svelte start page in `svelte/`. Treat `svelte/` as the app root unless the user explicitly asks about legacy extension packaging or root-level tooling.

The start page is a personal/school dashboard: menus, cards, schedules, weather, tips, remote announcements, and occasional whimsy. Whimsy canvases are one feature, not the whole app.

## Main App Map

- `svelte/src/App.svelte`: top-level layout, mode selection, secret hash routes, and card/menu composition.
- `svelte/src/Card.svelte`: shared card shell. Cards expose `data-whimsy-kind="card"` so overlays can find them.
- `svelte/src/CardContainer.svelte`: responsive card grid.
- `svelte/src/Menu.svelte`, `svelte/src/SubMenu.svelte`, `svelte/src/MenuItem.svelte`: start-page menus and nested menu items.
- `svelte/src/menus/`: hand-maintained menu data for staff, students, families, and common links.
- `svelte/src/util/menuComposer.ts`: combines base menu data, remote IACS menu data, custom menu items, and generated menu IDs.
- `svelte/src/prefs.ts`: local-storage-backed preferences such as school mode, hidden cards, collapsed menus, hidden menu items, and whimsy.
- `svelte/src/CardFetcher/`: remote cards loaded through a Google Apps Script endpoint.
- `svelte/src/Calendar/`, `svelte/src/Schedule/`, `svelte/src/Staff/`, `svelte/src/StudentGame/`, `svelte/src/Hawk/`: feature areas shown as cards.
- `svelte/src/whimsy/`: playful visual overlays and seasonal/secret effects. Read `ABOUT_WHIMSY_CANVAS.md` before changing canvas-wrapper code.

## Content Model

There are two major content surfaces:

- Menus: structured `Menuitem` objects with `title`, `link`, `icon`, `detail`, `items`, `school`, and related fields. Static menu data mostly lives in `svelte/src/menus/`; composed menu behavior lives in `svelte/src/util/menuComposer.ts`.
- Cards: Svelte card components plus remote cards. Remote cards come from a Google Apps Script URL in `svelte/src/CardFetcher/cardFetcher.ts` and render HTML from externally maintained Google Docs/sheets-style content. `RemoteCards.svelte` includes an "Edit original" link when the remote card data provides `url`.

Many links point to Google Docs, Google Sheets, Google Forms, Google Drive, or Google Sites. These are real school workflow links. Do not casually rewrite them, deduplicate them, or replace them with placeholders.

## Modes And Personalization

`App.svelte` uses a build-time-looking `mode` value with expected modes `"Staff"`, `"HS"`, `"MS"`, and `"Family"`. Mode affects menus, cards, schedule/weather visibility, school filtering, and whimsy behavior.

Preferences are mostly local-storage-backed Svelte stores in `prefs.ts`. When changing UI visibility, first check whether a preference store already exists. Hidden cards, hidden menu items, collapsed menus, selected school, and whimsy all have existing preference paths.

## Whimsy Canvases

Whimsy is the set of optional playful overlays and effects. For canvas-based whimsy, read [ABOUT_WHIMSY_CANVAS.md](ABOUT_WHIMSY_CANVAS.md) first. It documents the `WhimsyCanvas` wrapper, `startPage` API, coordinate rules, input handling, and `simple-canvas-library` usage.

Keep whimsy demos student-friendly:

- Prefer simple variables, arrays, objects, and direct control flow over clever abstractions.
- Use `WhimsyCanvas.svelte` for lifecycle, sizing, canvas styling, and cleanup. Demo components should mostly provide an `onLoad` setup callback.
- Do not call `gameCanvas.run()` or `gameCanvas.stop()` from whimsy demos.
- Do not add manual `ctx.clearRect(...)` to every drawing. `simple-canvas-library` already runs `requestAnimationFrame` and clears the canvas each frame before invoking drawings.
- Use `startPage.getItems(...)`, `startPage.mouse`, and `startPage` key handlers for interaction with the start page.
- Remember the canvas is click-through with `pointer-events: none`; canvas-level mouse handlers from `GameCanvas` are usually the wrong tool here.
- Use `item.rect` for mode-correct coordinates and compare start-page items by `item.id`.
- Use `stepTime` for movement so animations are frame-rate independent.
- When changing sprite sequences, be deliberate about `repeat`, `frameSequence`, and `frameAnimationIndex`.

## Working Style

The codebase has accumulated from real school needs. Prefer small, sympathetic changes that preserve existing behavior. Do not rename large concepts, reorganize folders, or clean up old extension leftovers unless the user asks for that refactor.

When verifying Svelte-only changes, prefer a focused compile or the smallest relevant project check. The full project may have unrelated work in progress, so do not clean up or revert files outside the task.
