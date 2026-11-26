# Stage 4 — WebGPU present efficiency

Read [`plan.md`](plan.md) Status first. This stage is **GPU frame cost** in
Hallu (one present, no extra canvas swapchains). It is not the stage-3 exe
shrink, not engine-wide RAM work, and not a Dawn rewrite.

Do not start this stage by “fixing” glass. The 25 Nov 2026 dump is the
before picture. Re-run that dump after every step. A passing white-screen
gate with widgets that are still holes is a failure of this stage.

## Goal

**One GPU device, one `queue.submit`, one present per shader frame.**

Dawn stays the compute/render API. The window compositor keeps **its**
swapchain (DXGI / viz). Hallu stops paying for a swapchain per surface and
per widget z. Widget glass is a draw into that one picture, sampled from
HDC at the card’s cutoff, not a transparent hole onto `.shader-background`.

**HaezanGL JS names (25 Nov 2026):** `navigator.haezanGL` and
`getContext('haezangl')` are aliases of `navigator.gpu` /
`getContext('webgpu')`. Dawn, WGSL, and `GPU*` types stay. That is
branding, not the present binding below.

The **present-binding** HaezanGL is still later: device + textures + one
mailbox into viz. It is not a shading language, not a replacement for
WebGPU, and not “no swapchain.” The monitor still flips.

## Locked

- Do **not** rewrite WebGPU, Dawn, WGSL, or DXGI.
- Do **not** delete the window swapchain. Draw-on-the-front-buffer is tear
  or vsync stall. That ring is how a GPU meets a monitor.
- Do **not** make every DOM element a `GPUCanvasContext`. Each
  `configure()` **is** a swapchain, a `getCurrentTexture()`, and a viz
  quad. That is the cost this stage removes.
- Do **not** copy `out\Release\hallu.exe` over `app/` unless the user
  asked. HDC list proofs stay on Release while the user’s Hallu is open
  ([`protocol.md`](protocol.md)). White-screen gate always uses
  `app/hallu.exe` through `live.mjs`.
- ≤ 2 days per engine bet, full visual parity ([`plan.md`](plan.md)
  refactor gate). A from-scratch graphics API does not clear that gate.
- Diagnose with a canvas dump and isolation shots before changing present
  code. Do not hide an empty canvas and call the stage done.
- Stage 3 (cut linked-but-unused) stays the current **exe** phase until
  Status says otherwise. Renderer steps in Hallu `bin/` do not wait for
  purge to finish. A host mailbox (HaezanGL) is hallulium work and still
  a ≤ 2 day bet; it is not “start RAM optimization.”

## Why (measured 25 Nov 2026)

Live dump on `app/hallu.exe`, cyberpunk, project-info + wow over the
viewer. Isolation: hide each canvas class with `opacity: 0 !important`,
shot, restore.

| canvas | z | backing store | opacity | role |
|---|---|---|---|---|
| `.shader-background` | 0 | 2560×1530 | 1 | only shader that painted |
| `.shader-torus` | 139 | 2560×1530 | 0 | menu closed, skipped |
| `.shader-overlay` | 202 | 2560×1530 | 0 | not drawing |
| `.shader-glass-layer` | 140 | **300×150** | 0 | project-info glass, never presented |
| `.shader-glass-layer` | 141 | **300×150** | 0 | hub glass, never presented |

Host: `haezansDomCapture.layers === true`, `append === false`. Renderer
sends one cutoff, `138`. Widgets sit at z 140 (project-info) and 141
(hub). Glass needs pictures at 139 and 140. `useCapture` misses, so
`encodeGlass` sets opacity 0 and **skips the size copy** — that is why
the glass canvases stayed at the default 300×150.

Isolation:

- Hide `.shader-glass-layer`: rain on the cards **unchanged**.
- Hide `.shader-background`: rain **gone everywhere**. Cards collapse to
  floating text on dark (`shader-paints-widgets` + no glass fill).
- Hide torus or overlay: no change.

So the wow + `saved Untitled.halluproj` crop is the z0 street canvas
showing through holes. It is not liquid glass. Fullscreen CSS on the
glass layers (`position: fixed; inset: 0` in `shaderSurfaces.css`) would
have been two more 2560×1530 presents if they had ever drawn.

Release (24 Nov 21:28) has the capture **list** (`append === true`) and
passed `hdcCapture.test.mjs`. That binary is not what `app/hallu.exe`
runs (still 24 Nov 18:28 until copied). Sending a list on the old host
kills the renderer (white / dead CDP). Gating the list on `append` kept
the window alive and left glass undrawn.

## Cost model (what we actually pay)

A `<canvas>` node is cheap. A **configured** `GPUCanvasContext` is not.

Per configured canvas, every shader frame:

- Dawn swapchain (typically 2–3 rgba8 textures of that canvas’s size)
- `getCurrentTexture()` + present into viz
- a compositor quad that HDC must include or skip

Memory (rgba8, ~3-buffer ring):

| size | ~swapchain |
|---|---|
| 300×150 (default, undrawn glass) | ~0.5 MB |
| card ~160×74 @ 1.5 dpr | ~0.15 MB |
| full window 2560×1530 | **~47 MB** |

Five fullscreen canvases ≈ 200 MB of rings before the pack’s own
targets. Fifty **card-sized** canvases would be a few MB of memory and
**fifty presents**. Memory is not the failure mode. Presents and
full-window dispatches are.

Hallu already has the cheap parts: one `GPUDevice`, one
`createCommandEncoder`, one `queue.submit` per frame
(`shaderBackgroundRenderer.ts`). Extra cost on that path today:

- `copyToMirrors`: another `configure()` per dock mirror, then
  `copyTextureToTexture` from the background’s current swapchain image.
- Compute passes default to one workgroup per **window** pixel
  (`dispatchSize` uses `program.width` × `program.height`).
- `encodePass` `createBindGroup`s every pass every frame.
- Capture: `new VideoFrame` + `importExternalTexture` every mailbox.
- Before each compute pass, a full-target `copyTextureToTexture` so
  unwritten texels keep last frame — double bandwidth if the pass writes
  every pixel anyway.
- Torus / overlay / glass stay configured at window size while opacity 0.

## Target architecture

```
DOM (text, icons, hit targets)
        │
        ▼
one WebGPU canvas  ──►  one Dawn swapchain  ──►  viz  ──►  window DXGI flip
        ▲
        │
   GPUTextures:  pack targets, capture (HDC), torus, overlay, glass
   draws:        iPanels rects / scissor / dirty dispatch
```

- `.shader-background` is the only `GPUCanvasContext` that presents.
- Torus, overlay, and widget glass are **textures or passes**, not
  canvases. `liquidGlass.frag` already loops `iPanels` and writes only
  inside `roundedCover`. One pass, N cards, one present.
- HDC still takes a cutoff per stacking number that glass must not see
  itself in. One `below([…])` when `append === true`. One cutoff on the
  old host is a **known hole**, not an optimization.
- Offscreen `GPUTexture` is not a swapchain. It never presents. Composite
  it into the one on-screen canvas.

HaezanGL (optional later): JS does not call `canvas.getContext('webgpu')`
per layer. It keeps Dawn for `GPUDevice` / `GPUTexture` / WGSL, then
`present(texture)` (or equivalent) publishes **one** mailbox to viz.
The window flip stays. Per-element canvases stay gone.

## Out of scope

- Rewriting Dawn, WGSL, or a new GPU API.
- “No swapchain” at the OS. Windows still presents through DXGI.
- One canvas per widget / header / splitter.
- Stage-3 cluster cuts (extensions, WebRTC, …).
- Copying Release into `app/` as a silent step.
- CSS-only glass (`widget-glass` in `widgets.css` is leftover; cards are
  pack-drawn).

## Phases

Stop a phase when its proof fails. Do not climb. Five failures in a row
of the same piece end that piece ([Hallu `AGENTS.md`](file:///C:/Users/zeela/Desktop/very%20important%20shit/code/hallu/AGENTS.md)
feature loop). White-screen gate has no 5-cap; it uses `app/hallu.exe`.

### A — Renderer, one present (Hallu `bin/`)

Hallu app only. No ninja. No `app/` copy.

**A0. Before dump (done 25 Nov 2026).**  
Live script: list every `canvas` (class, z, CSS box, backing store,
opacity), `haezansDomCapture.layers` / `append`, widget zs, isolation
shots (hide glass / background / torus / overlay / all). Keep this as
the before picture. Re-run after each A step.

**A1. Stop presenting empty rings.**  
Torus while the menu is closed, overlay when panel count is 0, glass
layers with no capture: `unconfigure()` (or never `configure()`), do not
`getCurrentTexture()`. Opacity 0 with a live swapchain still composites.

Proof: dump shows those canvases absent or unconfigured; `01-all.png`
unchanged for the street and the dock; white-screen gate passes.

**A2. Glass is a pass, not a canvas per z.**  
`encodeGlass` today creates a fullscreen `.shader-glass-layer` per
widget z, then `measureShaderPanels(… layerZ)` so each canvas only
fills that z’s cards. Draw those rects on the **one** presenting
surface (or one offscreen texture copied into it) with the same
`layerZ` filter and cutoff `useCapture`. Delete the extra canvas
elements.

Capture still needs a picture per cutoff for the glass to be *glass*.
On `append === false` the cards will keep showing the z0 street through
holes until phase B. **Do not fake glass** by leaving the holes. Prefer:
glass pass runs only when the cutoff picture exists; otherwise the card
fill stays the pack’s non-capture look (or opaque), not a street hole.
That is a visible change — prove it with isolation shots (hide
background; cards must not still be rain).

Proof: dump canvas count is 1 shader present (+ viewer 2D, + mirrors
until A4). Hide `.shader-background` and glass still shows **if** a
capture exists; if not, cards are not rain holes. `hdcCapture.test.mjs`
on Release still passes. White-screen gate on `app/hallu.exe` passes
and the three PNGs are not a white sheet.

**A3. Dirty rects.**  
Compute `dispatchSize` covers the window. Glass and panel-move passes
should dispatch (or scissor) only the union of dirty panel rects.
Skip the full-target copy before compute when the pass writes every
pixel it will present.

Proof: same pixels on a static frame; while dragging a widget the glass
does not trail (existing `panelsMoved` reason). Timestamp or a log of
dispatch `[x,y]` on a 107×49 card must not be `ceil(2560/8)` ×
`ceil(1530/8)` unless that pass is the street.

**A4. Mirrors.**  
`copyToMirrors` configures a WebGPU context per dock mirror and copies
out of the background swapchain. Prefer CSS/background on those
elements, or one atlas texture, or a CPU-less crop that is **not** a
swapchain per mirror.

Proof: dump has no extra `GPUCanvasContext` for mirrors; dock chrome
still shows the street crop.

**A5. CPU in `encodePass`.**  
Cache `GPUBindGroup`s when layout + resources are unchanged. Reuse the
capture `GPUExternalTexture` until HDC actually delivers a new mailbox.
Do not `createBindGroup` / `new VideoFrame` every pass every frame
unless the inputs changed.

Proof: dump + glass unchanged. Optional: `chrome://tracing` / Dawn
timestamps — bind-group creation per frame drops. Not a visual gate.

### B — Host the window actually runs

`app/hallu.exe` is the 25 Nov 19:55 host (`layers` true, `append` true,
HaezanGL names). Release and `app/` match.

**B1. Do not send `below([...])` unless `append === true`.** Already
gated in `haezansLayersAvailable()`. Keep it. A list on the old host is
a white screen.

**B2. Copy Release into `app/` only when asked.** Until then, list
proofs stay on `out\Release\hallu.exe` ([`protocol.md`](protocol.md):
hidden test window, not the user’s Hallu). After a copy: white-screen
gate, then A0 dump, then `hdcCapture.test.mjs` through `live.mjs` on
`app/hallu.exe`.

**B3. After app/ has `append`.** Isolation: hide `.shader-background`;
the wow and project-info card must still show a **warped capture of
what is behind them** (viewer / dock), not empty holes and not the
un-cutoff street. Magenta marker under the card at cutoff z still reads
`(255, 43, 215)` in the glass pass. Widget between two floating windows
on a presenting GPU surface (the old optional follow-up).

### C — HaezanGL present (optional, hallulium, ≤ 2 days)

Only after A has one presenting canvas and B has a host that can list
cutoffs. This is a present API, not a GPU rewrite.

**C1.** One Dawn texture published as a viz mailbox without a
`GPUCanvasContext` per layer. Files on the capture/present path only
(same compile rule as [`protocol.md`](protocol.md): prefer
`surface_aggregator.cc`; do not dirty `blink_core` headers; first ninja
line must be a small count or kill ninja).

**C2.** JS shape (names TBD): retain `GPUDevice` + WGSL; add
`present(texture)` / attach-to-layer. No per-widget `configure()`.

**C3.** Proof: square + list + liquid-glass on Release; white-screen
gate on `app/hallu.exe` after any copy; canvas dump shows **zero** extra
WebGPU canvases for torus/overlay/glass.

If C does not fit in two days with parity, stop. Keep phase A’s one
`GPUCanvasContext`. That is already the architecture.

## Proofs (always)

1. **Canvas dump** (`%TEMP%\hallu_canvas_dump.mjs` pattern): canvases,
   zs, backing stores, `layers` / `append`, widget zs, isolation PNGs.
   Read every PNG. A JSON pass with a wrong picture is a fail.
2. **White-screen gate:** `node bin/scripts/live.mjs run bin/tests/whiteScreen.test.mjs --shots "$env:TEMP\hallu_white_shots"`
   on `app/hallu.exe`. Open, +1.5 s, after opening a temp project. Not
   a white sheet. Close the instance when `run` returns.
3. **HDC / glass:** `hdcCapture.test.mjs` on Release per
   [`protocol.md`](protocol.md). Do not call `below()` from the script.
4. **`node bin/scripts/verify.mjs`** for renderer logic tests
   (`glassLayers.test.ts`, etc.). Do not edit the verify baseline to
   hide new problems.

## Files (renderer)

| Piece | Where |
|---|---|
| Present + encode | `bin/src/features/shaders/shaderBackgroundRenderer.ts` |
| Glass z / cutoffs | `bin/src/features/shaders/glassLayers.ts` |
| HDC JS | `bin/src/features/shaders/haezansDomCapture.ts` |
| Canvas CSS | `bin/src/features/shaders/shaderSurfaces.css` |
| Surfaces in DOM | `bin/src/features/shaders/ShaderBackground.tsx` |
| Panel rects | `bin/src/features/shaders/shaderPanels.ts` |
| Widget glass shader | `bin/src/styles/Hallu/animated/cyberpunk/liquidGlass.frag` |
| Widget z | `bin/src/shared/widgets/layerStack.ts` |
| White-screen | `bin/tests/whiteScreen.test.mjs` |
| HDC live | `bin/tests/hdcCapture.test.mjs` |

Host (only phase C, and B’s already-landed list):
`C:\hallulium\src\electron\shell\renderer\api\haezans_dom_capture.cc`,
`components/viz/service/display/surface_aggregator.cc`.

## Status of this stage

- **Written:** 25 Nov 2026.
- **Started:** 25 Nov 2026 (Hallu `bin/`, not a host copy).
- **A0 before picture:** `%TEMP%\hallu_canvas_dump_shots\`. App host
  `append: false`; two `.shader-glass-layer` canvases at 300×150 opacity 0.
- **A1 landed:** those canvases are gone. Torus unconfigures while the
  menu is closed (backing store stays 300×150). Overlay unconfigures when
  panel count is 0. Live dump `%TEMP%\hallu_present_shots\`: `glassLayers:
  0`, torus opacity 0, overlay opacity 0, background the only live
  swapchain. White-screen gate passed (0% white) on `app/hallu.exe`.
- **A2 landed (user-directed, 25 Nov 2026).** One `.shader-glass-layer`
  canvas per widget, plus one for the wow. Each canvas is the card's CSS
  box (not 100vw×100vh), carries `data-layer-z` / `data-hdc-cutoff`, and
  sits under the text. Project-info hover resizes the widget's child
  canvas with the card. The wow canvas is a sibling on `.widget-hub-anchor`
  (clip-path / writing-mode on `.widget-hub` hid a child canvas) and is
  pinned to the hub's `getBoundingClientRect` every frame, including
  ball→bar→open. Liquid glass runs in the torus program's window-sized
  buffers; `Torus.frag` crops with `iTorusRect` (written even when the
  menu has no state — a zero rect sampled the bottom-left of the buffer).
  Isolation `%TEMP%\hallu_a2_dump_shots\hide-background.png`: street
  hidden, glass remains on wow + project-info. Expand
  `%TEMP%\hallu_a2_shots\03-wow-open.png`. White-screen gate passed.
  Fullscreen per-z canvases stay gone. Did not copy `app/`.
- **A3 partial:** skip the full-target copy before a compute pass that
  rewrites the other texture. No dirty workgroup offset (WGSL would have
  to take an origin).
- **A4 landed:** dock mirrors are 2D `drawImage` after submit, not
  WebGPU swapchains.
- **A5 landed:** bind groups reused while views/external serial match;
  external bind groups dropped at the start of each frame.
- **B copy (25 Nov 2026, 19:55):** Release `hallu.exe` + DLLs + paks +
  locales + snapshots copied into `app/` (hash match). Probe on
  `app/hallu.exe`: `navigator.haezanGL === navigator.gpu`,
  `getContext('haezangl')` same as `'webgpu'`, `layers` true, `append`
  true. White-screen gate passed (0% white).
- **C:** not started.
- **Next:** C only if asked. Do not start C.
