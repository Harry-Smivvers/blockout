# Blockout 3D — CLAUDE.md

## Project Overview

Single-file HTML5 game (`index.html`). A 3D Tetris variant (Blockout) rendered with Three.js (r128 via CDN). No build system, no dependencies to install — open in a browser and play.

## Architecture

Everything lives in `index.html`:
- **CSS**: Dark-themed UI, responsive layout, mobile controls
- **HTML**: Overlays, sidebar panels, mobile button grid
- **JavaScript**: Full game logic + Three.js rendering

### Key Constants

```js
const GW = 5, GD = 5, GH = 20;  // grid: 5×5 pit, 20 layers deep
```

### Core Data Structures

| Variable | Type | Purpose |
|---|---|---|
| `grid[y][x][z]` | `Uint8Array` | Occupied cells (1 = filled) |
| `gridColor[y][x][z]` | `Uint32Array` | Color per cell (stored at lock, unused at render — layer color wins) |
| `piece` | object | Active piece: `{ cells, color, defIdx, gx, gy, gz }` |
| `queue` | array | Next-piece queue (always 4 items, 3 shown in preview) |
| `lastLockedPiece` | object\|null | `{ defIdx, color }` of last locked piece — used by Undo |
| `lastLockedCells` | array\|null | Absolute grid positions `[gx,gy,gz][]` of last locked piece |
| `canUndo` | bool | True only if last lock caused no layer clear |

### Coordinate System

Grid coords `(gx, gy, gz)` map to Three.js world coords via `g2w()`:
```
wx = GW - 1 - gx   (X flipped so screen-left = game-left)
wy = gz             (Z grid → Y world: left/right face height)
wz = gy             (Y grid → Z world: depth into pit)
```
Pieces fall along `gy` (0 = spawn/foreground → GH-1 = floor/background).

### Three.js Scene Groups

| Group | Content |
|---|---|
| `grpField` | Static wireframe pit walls |
| `grpPlaced` | Locked/settled blocks (solid cubes) |
| `grpGhost` | Ghost piece (transparent wireframe) |
| `grpPiece` | Active piece (solid or wireframe) |

### Piece Definitions

18 piece shapes in `PIECE_DEFS`, each as an array of `[x, y, z]` cell offsets. Pieces are 3D (1–4-cell variants including L, S, Z, and cube shapes). `defIdx` is stored on the piece object to support Undo.

### Layer Colors

`LAYER_COLORS` uses the **golden angle** hue formula so no two adjacent layer indices share a similar hue:
```js
c.setHSL((i * 0.618033988749895) % 1, 0.88, 0.54);
```
Adjacent layers are ~222° apart in hue (Blue→Pink→Yellow is fine; Pink→Red never occurs).

### Scoring

| Event | Points |
|---|---|
| Lock piece | `100 × number of cells` |
| Clear a full layer | `5000` |
| Level up | Every 5 cleared layers |
| Speed formula | `baseDropInterval × max(0.1, 1 − (level−1) × 0.075)` |

## Sidebar Layout (top → bottom)

1. **Score** — current score
2. **Level** — current level
3. **Lines** — cleared layer count
4. **Next** — 3 next-piece preview canvases (`np0`–`np2`)
5. **Layers** — `#layer-strips`: 20 horizontal color strips (6px each, 4px on mobile); occupied layers show their `LAYER_COLORS` color, empty layers show dark `#1a2540`; updated by `updateLayerStrips()` called at end of `renderPlaced()`
6. **`#action-btns`** — frameless button group (3px gap), no panel border/background:
   - `GRID: OFF / ON` — toggles active piece wireframe (`T` key equivalent)
   - `UNDO` — undoes last placed piece (`U` key equivalent)
   - `NEXT` — skips current piece (`N` key equivalent)
7. **Points** — duplicate score display

## Controls

| Input | Action |
|---|---|
| `← →` | Move X |
| `↑ ↓` | Move Y (depth) |
| `R` | Soft drop |
| `Space` | Hard drop |
| `A / D` | Rotate Y axis |
| `W / S` | Rotate X axis |
| `Q / E` | Rotate Z axis |
| `P` | Pause / Resume |
| `T` | Toggle active piece wireframe/solid |
| `U` | Undo last placed piece |
| `N` | Skip current piece (discard, spawn next) |

Touch swipe on canvas: horizontal = move X, swipe down = soft drop, swipe up = rotate Y.

## Important Implementation Notes

- **Rotation** uses `rotateCells()` with 8-position wall-kick table.
- **Layer clear** shifts all layers above downward in place (no flash animation).
- **Audio** is a Web Audio API arpeggio on layer clear; silently fails if unavailable.
- **Resize** recalculates canvas size to fit available viewport, accounting for sidebar and mobile controls bar height.
- **Speed input** (bottom-right, `position: fixed`) sets `baseDropInterval` in seconds; takes effect immediately during play.
- **`pieceWireframe`** flag switches the active piece between solid and wireframe display.
- The renderer uses `polygonOffset` on solid block faces to prevent z-fighting with edge lines.
- **Undo** is disabled (`canUndo = false`) when the last locked piece triggered a layer clear — the grid shift makes the stored cell positions invalid.
- **Skip** (`skipPiece`) also resets `canUndo` to prevent undoing an earlier piece after a skip.
- On small screens the sidebar is `overflow-y: auto` with a capped `max-height` so it scrolls rather than overlapping the fixed speed control.

## What NOT to Change

- The CDN link for Three.js r128 — the API calls are tightly coupled to this version.
- The `g2w()` coordinate mapping — changing it will break all rendering.
- The golden-angle formula in `LAYER_COLORS` — it prevents similar adjacent hues.
- `defIdx` on the piece object — required by Undo to respawn the correct piece shape.
