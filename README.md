# BLOCKOUT 3D

> **Tetris never prepared you for the third dimension.**

<p align="center">
  <img src="https://img.shields.io/badge/no%20build-just%20open-brightgreen?style=flat-square"/>
  <img src="https://img.shields.io/badge/dependencies-0-blue?style=flat-square"/>
  <img src="https://img.shields.io/badge/WebGL-raw-orange?style=flat-square"/>
  <img src="https://img.shields.io/badge/mobile-ready-purple?style=flat-square"/>
  <img src="https://img.shields.io/badge/license-MIT-lightgrey?style=flat-square"/>
</p>

---

**[▶ PLAY NOW — open `index.html` in any browser. No install. No server. No nonsense.](#-quick-start)**

---

## What is this?

Blockout 3D is the classic falling-block puzzle — but in **full 3D**.

Instead of placing flat tetrominoes into a flat well, you drop **3D polycubes** into a **5×5×20 pit**. The goal: fill entire horizontal layers to clear them. Sounds simple. It isn't.

- You rotate pieces on **three axes** (X, Y, Z)
- You navigate them in **two horizontal directions** (X, Z)
- Layers only clear when **every single cell** in them is filled
- One wrong rotation can ruin three layers at once

It is the original Blockout (1989) reborn in raw WebGL — with zero libraries, zero build step, and zero compromise.

---

## Features

| | |
|---|---|
| **Raw WebGL rendering** | No Three.js, no Canvas 2D. Everything is hand-rolled GLSL. |
| **18 unique 3D piece shapes** | From simple 1×1×4 lines to wild L/T/S/Z 3D variants. |
| **Golden-angle layer colors** | Adjacent layers always have maximally different hues. |
| **Ghost piece + wireframe** | See exactly where your piece will land. Toggle solid/wireframe. |
| **Live layer indicator** | Left-side bar shows fill % for all 20 layers at a glance. |
| **Adjustable fall speed** | 0.5 s – 30 s per drop. Tune difficulty on the fly. |
| **Undo last piece** | Placed it wrong? Take it back (once, no layer-clears). |
| **Mobile-first controls** | Full D-pad + rotation buttons + swipe gestures. |
| **No dependencies** | One HTML file + four JS files + one CSS file. That's it. |
| **Runs offline** | Open from your desktop. No server, no network, no CDN. |

---

## Quick Start

```bash
git clone https://github.com/Harry-Smivvers/Blockout.git
cd Blockout
# open index.html in your browser — done.
```

Or just [download the ZIP](../../archive/refs/heads/main.zip) and double-click `index.html`.

---

## Controls

### Keyboard

| Key | Action |
|---|---|
| `← →` | Move piece along X |
| `↑ ↓` | Move piece along Z (front/back) |
| `R` | Soft drop (one step down) |
| `Space` | Hard drop (instant) |
| `W / S` | Rotate around X axis |
| `A / D` | Rotate around Y axis |
| `Q / E` | Rotate around Z axis |
| `G` or `T` | Toggle wireframe / solid |
| `U` | Undo last placed piece |
| `N` | Skip current piece |
| `P` or `Esc` | Pause / Resume |
| `Tab` | Show / hide on-screen controls |

### Touch / Mobile

- **Swipe left/right** on the canvas → move X
- **Swipe up/down** → move Z
- On-screen **D-pad** and **rotation buttons** appear when the game starts
- The `Controls` toggle collapses/expands the button panel to reclaim screen space

---

## Scoring

| Event | Points |
|---|---|
| Lock a piece | `100 × cells in piece` |
| Clear a full layer | `5 000` |
| Level up | Every 5 cleared layers |
| Speed increase | `baseSpeed × max(0.1, 1 − (level−1) × 7.5%)` |

---

## File Structure

```
index.html          Game engine (WebGL) + HTML shell
ui/
  styles.css        All UI styling
  main.js           window.ui API surface
  hud.js            Score, level, fall-time stepper, pause
  controls.js       D-pad, rotation buttons, DROP/UNDO/SKIP/GRID
  layers.js         Left-side layer fill indicator
  tutorial.js       First-visit tutorial overlay
```

No build step. No bundler. No framework. The entire engine lives in `index.html`.

---

## Why no library?

Because it doesn't need one.

The geometry is a unit cube. The math is one perspective matrix, one lookAt, and one translation per block. The shader is eight lines of GLSL. Pulling in Three.js for this would be like renting a stadium to store a bicycle.

Writing raw WebGL also means the code is a direct map from "how 3D rendering works" to "what appears on screen" — no abstraction layer to fight through when something goes wrong.

---

## Technical Highlights

- **Column-major mat4** — perspective, lookAt, multiply, and translation implemented from scratch; compatible with `gl.uniformMatrix4fv`
- **Polygon offset** — `polygonOffset(1, 1)` prevents z-fighting between solid cube faces and their edge lines
- **Thick-line simulation** — WebGL `lineWidth` is capped at 1 px by most drivers; thickness is faked via CSS `filter: brightness contrast` + two line-color sets
- **Separate WebGL contexts** — next-piece previews each get their own `<canvas>` + context so they never share state with the main scene
- **Golden-angle hues** — `hue = (i × 0.618033…) % 1` — guarantees maximum perceptual distance between adjacent layer colors

---

## Screenshots

> *(drop some GIFs here — a well-placed 5-layer clear GIF will sell this faster than any description)*

---

## Roadmap / Ideas

- [ ] High-score persistence (localStorage)
- [ ] Custom pit sizes (e.g., 4×4×16 or 6×6×24)
- [ ] Keyboard rebinding
- [ ] Multiplayer (shared board, competitive clears)
- [ ] Replay export

PRs welcome. See the CLAUDE.md for full architecture notes before diving in.

---

## License

MIT — use it, fork it, ship it.

---

---

---

# BLOCKOUT 3D — Deutsche Version

> **Tetris hat dich nicht auf die dritte Dimension vorbereitet.**

---

**[▶ JETZT SPIELEN — `index.html` im Browser öffnen. Kein Install. Kein Server. Keine Ausreden.](#-schnellstart)**

---

## Was ist das?

Blockout 3D ist das klassische Fallblock-Puzzle — aber in **echtem 3D**.

Statt flacher Tetrominoes in ein flaches Becken stapelst du **3D-Polywürfel** in eine **5×5×20 Grube**. Ziel: vollständige horizontale Ebenen ausfüllen und clearen. Klingt einfach. Ist es nicht.

- Du rotierst Teile um **drei Achsen** (X, Y, Z)
- Du bewegst sie in **zwei horizontalen Richtungen** (X, Z)
- Eine Ebene leert sich nur, wenn **jede einzelne Zelle** gefüllt ist
- Eine falsche Rotation kann auf einen Schlag drei Ebenen ruinieren

Das ist das Original-Blockout (1989) — neugeboren in raw WebGL, ohne externe Bibliotheken, ohne Build-System, ohne Kompromisse.

---

## Features

| | |
|---|---|
| **Raw WebGL** | Kein Three.js, kein Canvas 2D — alles handgeschriebenes GLSL. |
| **18 einzigartige 3D-Formen** | Von simplen 1×1×4-Stäben bis zu wilden L/T/S/Z-Varianten. |
| **Goldener-Winkel-Schichtfarben** | Benachbarte Ebenen haben immer maximal verschiedene Farbtöne. |
| **Geisterstück + Wireframe** | Sieh genau, wo dein Teil landet. Solid/Wireframe umschaltbar. |
| **Live-Ebenen-Anzeige** | Die linke Leiste zeigt den Füllstand aller 20 Ebenen auf einen Blick. |
| **Verstellbare Fallgeschwindigkeit** | 0,5 s – 30 s pro Drop. Schwierigkeit jederzeit anpassbar. |
| **Undo-Funktion** | Falsch gesetzt? Einmal zurücknehmen (solange keine Ebene geclearet wurde). |
| **Mobile-First-Steuerung** | Vollständiges D-Pad, Rotationstasten und Swipe-Gesten. |
| **Null Abhängigkeiten** | Eine HTML-Datei + vier JS-Dateien + eine CSS-Datei. Das wars. |
| **Offline spielbar** | Einfach vom Desktop öffnen — kein Server, kein Netzwerk. |

---

## Schnellstart

```bash
git clone https://github.com/Harry-Smivvers/Blockout.git
cd Blockout
# index.html im Browser öffnen — fertig.
```

Oder [ZIP herunterladen](../../archive/refs/heads/main.zip) und `index.html` doppelklicken.

---

## Steuerung

### Tastatur

| Taste | Aktion |
|---|---|
| `← →` | Teil entlang X bewegen |
| `↑ ↓` | Teil entlang Z bewegen (vorne/hinten) |
| `R` | Sanfter Drop (ein Schritt) |
| `Space` | Hard Drop (sofort) |
| `W / S` | Um X-Achse rotieren |
| `A / D` | Um Y-Achse rotieren |
| `Q / E` | Um Z-Achse rotieren |
| `G` oder `T` | Wireframe / Solid umschalten |
| `U` | Letztes Teil rückgängig |
| `N` | Aktuelles Teil überspringen |
| `P` oder `Esc` | Pause / Weiterspielen |
| `Tab` | Touch-Controls ein-/ausblenden |

### Touch / Mobile

- **Wisch links/rechts** auf dem Canvas → X-Bewegung
- **Wisch hoch/runter** → Z-Bewegung
- On-Screen **D-Pad** und **Rotationstasten** erscheinen beim Spielstart
- Der `Controls`-Toggle klappt das Steuerungsfeld zusammen, um mehr Platz zu schaffen

---

## Punkte

| Ereignis | Punkte |
|---|---|
| Teil einrasten | `100 × Anzahl Zellen` |
| Ebene leeren | `5.000` |
| Level-Up | Alle 5 geleerten Ebenen |
| Geschwindigkeitsformel | `Basiszeit × max(0,1, 1 − (Level−1) × 7,5%)` |

---

## Dateistruktur

```
index.html          Spiel-Engine (WebGL) + HTML-Shell
ui/
  styles.css        Komplettes UI-Styling
  main.js           window.ui API
  hud.js            Score, Level, Fallzeit-Stepper, Pause
  controls.js       D-Pad, Rotationstasten, DROP/UNDO/SKIP/GRID
  layers.js         Linke Ebenen-Füllstandsanzeige
  tutorial.js       Tutorial-Overlay für Erstbesucher
```

Kein Build-Schritt. Kein Bundler. Kein Framework. Die gesamte Engine steckt in `index.html`.

---

## Warum keine Bibliothek?

Weil es keine braucht.

Die Geometrie ist ein Einheitswürfel. Die Mathematik ist eine Perspektivmatrix, ein LookAt und eine Translation pro Block. Der Shader ist acht Zeilen GLSL. Three.js dafür einzusetzen wäre wie ein Stadion zu mieten, um ein Fahrrad abzustellen.

Raw WebGL bedeutet auch: der Code ist eine direkte Abbildung von „wie 3D-Rendering funktioniert" auf „was auf dem Bildschirm erscheint" — keine Abstraktionsschicht, die einem in die Quere kommt, wenn etwas schiefläuft.

---

## Technische Highlights

- **Spalten-majore mat4** — Perspective, LookAt, Multiply und Translation von Grund auf implementiert; kompatibel mit `gl.uniformMatrix4fv`
- **Polygon Offset** — `polygonOffset(1, 1)` verhindert Z-Fighting zwischen soliden Würfelflächen und deren Kanten
- **Thick-Line-Simulation** — WebGL `lineWidth` wird von den meisten Treibern auf 1 px begrenzt; Dicke wird über CSS `filter: brightness contrast` + zwei Farbsets simuliert
- **Separate WebGL-Kontexte** — Jede Vorschau der nächsten Teile hat ihren eigenen `<canvas>`, damit kein State mit der Hauptszene geteilt wird
- **Goldener-Winkel-Farben** — `Farbton = (i × 0,618033…) % 1` — garantiert maximalen Wahrnehmungsabstand zwischen benachbarten Ebenenfarben

---

## Screenshots

> *(GIFs hier einfügen — ein guter 5-Ebenen-Clear-GIF verkauft das besser als jeder Text)*

---

## Roadmap / Ideen

- [ ] Highscore-Speicherung (localStorage)
- [ ] Anpassbare Grubengrößen (z. B. 4×4×16 oder 6×6×24)
- [ ] Tastenbelegung anpassen
- [ ] Multiplayer (gemeinsames Brett, Wettbewerbs-Clears)
- [ ] Replay-Export

PRs sind willkommen. Für die vollständige Architektur-Dokumentation vor dem Eintauchen die CLAUDE.md lesen.


