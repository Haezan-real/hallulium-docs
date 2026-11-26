# HDC loop protocol

Read this file at the start of every turn of the HDC loop, including after a
summary. Then read `docs/plan.md` Status. Update both after each finished
engine step. Do not ask the user anything. Do not stop until the square proof
passes, then do the liquid-glass proof.

## What “fixed” means

`window.haezansDomCapture.below(138)` returns one GPU image of everything
whose root-level z-index is **<= 138**, after it has been drawn. The torus
shader is z-index 139. Widgets are above that. Nested z-index does not
escape its parent: a button inside a z-index 400 widget stays 400.

Square proof (the loop gate). Hidden test window, not the user’s Hallu.
Three DOM boxes, then sample the capture:

- `#hdc-below` fixed, z-index 12, `#ff2bd6`, `isolation: isolate`, with a
  child `#hdc-nest` absolute `#39ff14` and no z-index.
- `#hdc-above` fixed, z-index 400, `#00e5ff`.
- Device pixels at dpr 1.5: nest center, a corner of the magenta box that is
  not on the green child, cyan center.
- Pass: magenta pixel is about `(255, 43, 214)`, green about `(57, 255, 20)`,
  cyan is **not** `(0, 229, 255)`.
- Square proof passed on the decomposite build (19 Nov 2026, 15:52):
  green `(57, 255, 20)`, magenta `(255, 43, 214)`, cyan `(14, 3, 43)`
  which is the page, not `(0, 229, 255)`. Passed again on the capture-list
  build (24 Nov 2026, 21:28): green `(59, 255, 21)`, magenta `(255, 43, 215)`,
  cyan `(5, 1, 15)`.
- `below` takes a number or a list. The first cutoff binds one client.
  Later zs are negative on that same pipe. `haezansDomCapture.layers` is
  true. Pictures are tagged `token >> 16`. A later `below` with more zs
  appends; it does not rebind.
- List proof (24 Nov 2026): `below([50, 250])` produced both pictures. A
  z-index 200 orange box was missing at 50 and present at 250; cyan at
  400 was in neither.
- `DecompositeEffect` in `paint_artifact_compositor.cc` no longer folds an
  effect into a parent group whose used stacking z differs. That is what
  put the cyan box on its own quad so the cutoff could drop it. Leave that
  check in place.
- Liquid-glass script passed on the decomposite build (19 Nov 2026, 16:06)
  and again on the capture-list build (24 Nov 2026, 21:36). The time widget
  over each spot, then a magenta marker at the widget's cutoff z: viewer,
  both media panels, tool, timeline panel, page background, timeline, the
  clip, and the playneedle each became `(255, 43, 215)`. The TEE keeps one
  canvas per cutoff and samples the card's cutoff, not the last picture.
  The `.shader-torus` canvas read back all zeros; the menu was closed.
- Extra capture trees are built from the original pass list, then inserted
  together. Capture passes are not cached. Do not copy over `app\hallu.exe`.

## Liquid-glass proof

`bin/tests/hdcCapture.test.mjs`, launched with `live.mjs` against
`out\Release\hallu.exe`. It switches the style to cyberpunk, opens the
time widget, and drags it over the viewer canvas, each docked panel, the
page background, the timeline, a clip, and the playneedle. At each spot
the widget glass must be drawing, and a magenta marker placed under the
widget must show up in the `.shader-torus` pixels. That canvas is the
liquid-glass pass: it draws nothing unless the capture is bound. Do not
call `haezansDomCapture.below` from the script; that replaces the shader's
callback. The script may write `hallu.*` localStorage; `live.mjs` restores
the snapshot afterwards, which writes `settings.json` back.

## Compile rule

Only touch `.cc` files on the capture path. Do not edit a widely included
header. Do not touch a header’s mtime to “restat” it; that rebuilds Blink.

Preferred files, in order:

1. `components/viz/service/display/surface_aggregator.cc`
2. `third_party/blink/renderer/platform/graphics/compositing/property_tree_manager.cc`
3. `cc/layers/layer_impl.cc` and `cc/layers/render_surface_impl.cc`
4. `third_party/blink/renderer/core/paint/paint_property_tree_builder.cc`
   only when the number is still 0 on the blink effect. This dirties
   `blink_core` and can rebuild the V8 snapshot. Avoid it until a quad dump
   shows the blink value never arrives.

Before linking, the first ninja progress line must be a small count (about
40 or fewer). If it is hundreds, kill ninja immediately. Do not wait on a
dead terminal. Every wait is at most 10 minutes, then check that `ninja`,
`clang-cl`, or `lld-link` is actually running. A live linker may run longer
than 10 minutes; a silent dead shell may not.

Command, from `C:\hallulium\src`:

```
C:\hallulium\src\third_party\ninja\ninja.exe -C C:\hallulium\src\out\Release electron
```

Do not copy over `app\hallu.exe` while the user’s Hallu is running. Test
with `C:\hallulium\src\out\Release\hallu.exe`.

## Test launch

`node bin/scripts/live.mjs status` must print `not running` first. Never
attach to port 9333 if something is already there.

Spawn `out\Release\hallu.exe` with cwd `bin`, env `HALLU_LIVE_TEST=1` and
`ELECTRON_DEV=true`, args `main.cjs --remote-debugging-port=9333
--disable-features=CalculateNativeWinOcclusion
--disable-renderer-backgrounding --disable-backgrounding-occluded-windows`.
Write `%TEMP%\hallu-live.json` with that pid so `live.mjs` closes only that
process. Then:

```
node bin/scripts/live.mjs run %TEMP%\hallu_hdc_proof.mjs
```

The script is the three-box proof. Do not take a desktop screenshot and do
not move the real mouse. The proof is the sampled pixels. Quad dump, when
present, is `%TEMP%\hdc-quads.txt`. Remove the dump once the pixels pass.

## Loop

1. Reread this file.
2. Change the smallest file that the last evidence points at.
3. Build. If the progress count is huge, stop and narrow the edit.
4. Run the square proof.
5. If it fails, write the pixel values and the new hypothesis here, and go
   back to 2.
6. If it passes, update `plan.md` Status and do the liquid-glass proof.

## After the squares pass

Run the liquid-glass proof against `out\Release\hallu.exe` (the user’s
`app\hallu.exe` stays untouched while it is open). The script lives at
`bin/tests/hdcCapture.test.mjs` and is launched with `live.mjs`, not as a
unit test. It switches the style to cyberpunk, then places a widget over
the viewer canvas, docked panels, the page background, the timeline, a
clip, and the playneedle. For each spot, sample the capture under the
widget and require the thing underneath, not the widget’s own pixels.
Create the script when the square proof first passes, not before.
