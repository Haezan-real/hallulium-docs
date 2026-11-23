# Hallulium plan

Agents: if the user is working on hallulium, Electron, or Chromium for Hallu,
read this file first and update the **Status** section after every finished
step. Do not invent a new plan. A chat summary is not the source of truth;
this file is.

## Goal

**Hallu is one product.** The entry point is **`hallu.exe`**: the native
shell that runs Blink → Skia → the TypeScript/HTML DOM (and, in dev, can
start Vite). There is no separate product called “hallulium,” “electron,”
or “chromium” for users or for how we talk about the app. Runtime
optimizations (RAM, CPU) come **after** the source purge.

Under the hood the tree is still a trimmed Chromium/Electron-derived
engine until purge + rename land; that is implementation debt, not the
product model.

## Decisions (locked)

- **Product model (locked):** abolish the Hallu-vs-shell split. Hallu **is**
  the shell. Ship/run **`hallu.exe`**. No mental “hallulium runs Hallu.”
  Dev: `hallu.exe` is also how you enter the app (including launching Vite
  when that is wired).
- **Native shape (locked):** `hallu.exe` = Blink → Skia → TS/HTML DOM hybrid
  (shell + app). Easy/medium pure logic is ported to **C++ and compiled to
  DLLs** (or static libs) that `hallu.exe` loads **in-process**. Ranked port
  list and DLL split: [`cpp-port.md`](cpp-port.md). Not WASM-first; not a
  separate math process.
- **Shell execution (locked):** do **not** hand-extract Blink→Skia (spiderweb).
  Unit of work = an **embed build target** (`content_shell` and/or current
  Electron host) whose deps GN/Ninja already define. Brand that host
  `hallu.exe`, load Hallu, then shrink **that** closure. How-to:
  [`shell-hybrid.md`](shell-hybrid.md).
- **Timescale (locked):** “Possible?” means **days, one week max** for a
  bet — not years. Hallu MVP ship target ≈ **one month**. No from-scratch
  HTML/CSS engine, no multi-year Blink rewrite. Prefer polish + cut scope
  on the stack that already runs.
- **Refactor gate (locked):** any engine/UI refactor must be **≤ 2 days**,
  and must preserve **every** existing Hallu feature/edge case (app stays
  identical). A rewrite is allowed only if it meets both: full parity **and**
  ≤ 2 days — which rules out native/Qt/ImGui/Blink-extract/Token Burner as
  near-term work. Allowed: branding (`hallu.exe`), wiring, polish, bugfixes,
  light packaging trim on the **current** host.
- **Engine taste (wanted):** hate shipping “full Chrome”; want roughly
  **V8 + Blink→Skia** (live HTML/CSS/JS) only. **Conflict note:** that thinner
  host is the right long-term taste, but it **does not** clear the ≤2-day +
  full-parity gate (Electron APIs / Node / paks Hallu uses). Resolve by either
  relaxing time/parity for a `content`-shaped `hallu.exe`, or staying on the
  current host until after ship.
- **Size goal:** aspire to a smaller runtime; **&lt;50 MB total with Blink/V8
  still inside is not realistic** (current dist ~400 MB, host exe ~220 MB).
  Sub‑50 MB means a **non‑Chromium** UI stack (or a radically different
  product). Near-term size work = cut unused pak/ICU/locales/ffmpeg fat,
  not “Blink in 50 MB.”
- **Token Burner 3000 (parked):** post-revenue autonomous TS↔C++ UI grind
  (screenshots + port). Bookmark only until Hallu ships/makes money —
  [`token-burner-3000.md`](token-burner-3000.md). Not the MVP path.
- **Name (legacy path, until move):** engine checkout still at
  `C:\hallulium` for now (was `halluium` / `C:\electron-42`). Target
  layout later: everything under Hallu (e.g. `C:\hallu`) with **`hallu.exe`**
  as the binary name — not `hallulium.exe` / `electron.exe`.
- **GitHub (docs):** `Haezan-real/hallulium-docs` — plan, purge log, apply
  script only. Not the engine tree. (Rename docs repo when convenient.)
- **GitHub (engine, later):** orphan import as Hallu engine repo when ready;
  no Chromium commit chain. Name should match Hallu, not “hallulium.”
- **Binaries:** never commit `out/`, `*.exe`, `*.dll`, build products; gitignore them.
- **Hallu git:** never add the engine source tree to the Hallu app repo
  until an explicit monorepo decision.
- **Disk:** engine lives at `C:\hallulium` today (real rename done; no junction).
- **Keep macOS:** never purge Mac / Darwin / Cocoa source; phone (iOS,
  Android) only for platform cuts.
- **Purge test (locked):** keep a path only if a **Hallu developer
  environment** needs it (build + run Hallu). If not needed → delete. If
  something still references it → unhook or restore real (no empty stubs).
  Full rule:
  [`purge/unused by electron purge/README.md`](../purge/unused%20by%20electron%20purge/README.md).
  “Chromium/ChromeOS still builds every target” is not a keep reason.
- **Order:** (1) save pending capture edit (2) rename (3) update configs/docs
  (4) purge in small phases with rebuild proof (5) create orphan GitHub repo
  and push (6) only then RAM/CPU work.

## Status

- **Current phase:** stage 3 — cut linked-but-unused code, then rebuild
  `hallu.exe`. Blink modules Hallu does not call are removed. The purged
  GN shells (`android_webview`, `ash`, `apps`, `headless`, `rlz`,
  `codelabs`, and the Hallulium stub `BUILD.gn` files) are removed, and
  the Release host still links and launches. Larger clusters (extensions,
  WebRTC, autofill, pdfium, chrome, ANGLE, Dawn OpenGL) are still in the
  link. Purge phases 01–14, DevTools, and password_manager source cuts
  are done. `hallu.exe` is the Electron host and the Hallu launcher.
- **Last done:** Purged GN shells (23 Nov 2026). Deleted 532 stub GN
  files, the empty folder trees they left, and the source-less
  `android_webview`, `ash`, `apps`, `headless`, `rlz`, and `codelabs`
  trees. Windows `gn gen` no longer imports those targets. View clip
  paths are a Skia round rect, and the ChromeOS reven GPU switch is
  gone with ash. `ninja -C out/Release hallu.exe` linked (245,024,256
  bytes). Launch check: that binary opened the editor at
  `http://localhost:5173/`, title Hallu, `.widget-hub-ball` present,
  behind other windows, then closed. Node stays with V8. Mac source was
  not deleted. `build_overrides` stayed.
- **Next action:** next stage-3 cluster is still unchosen (extensions,
  WebRTC, autofill, pdfium, chrome are the largest). When the HDC loop
  resumes, read `docs/protocol.md` first. Re-check the per-element glass
  on one Hallu window whose GPU surface is presenting: a widget between
  two floating windows, the glass canvas at that widget's z, and that
  canvas sampling the cutoff under it.
- **Blocked on:** nothing for launch

## Paths

| Role | Path |
|---|---|
| Engine root (**builds** and human) | `C:\hallulium` |
| Chromium source | `C:\hallulium\src` |
| Electron nested repo | `C:\hallulium\src\electron` |
| Build output (gitignored) | `C:\hallulium\src\out` |
| Built host binary | `C:\hallulium\src\out\Release\hallu.exe` |
| Hallu runs | `app/hallu.exe` + dlls/paks (`app/resources/app` → `bin`; folder icon is the day icon) |
| Build command | `h build` (also `hallulium`, still `e build`) |
| Build-tools config | `C:\Users\zeela\.electron_build_tools\configs\evm.hallu-42.json` (`root`) |
| Docs / progress git checkout | `C:\halluium-repo` (rename to `C:\hallulium-docs` when unlocked) → `Haezan-real/hallulium-docs` |
| Hallu app | still `...\code\hallu` until a later move |

## Branches

- Chromium: `hallu-no-cursor` in `C:\hallulium\src`
- Electron: `hallu-42.11.3` in `C:\hallulium\src\electron` (also on
  `Haezan-real/electron`)
- Pending local Chromium edit (must save before purge): whole cached-pass
  export in `components/viz/service/display/surface_aggregator.cc`

## Purge rules

- **Hallu-dev-env test** is the gate (see Decisions). Not “does Chromium
  still know about this folder.”
- After each risky delete: `h build` from `C:\hallulium\src` must still
  produce a Hallu-running runtime. If gen/build fails only because of a
  leftover import/data_dep, unhook or restore real (no empty stubs) — see
  [`purge/unused by electron purge/README.md`](../purge/unused%20by%20electron%20purge/README.md).
- Expect Hallu still needs core browser pieces (Blink, `cc`, viz, `gpu`,
  `v8`, and whatever `third_party` those link). Delete them only if you
  have replaced that need.
- **Keep all macOS / Darwin / Cocoa related source.** Hallulium may ship on Mac.
  Phone platforms (iOS, Android) and ChromeOS-only trees are fair game if
  Hallu’s Windows/Mac developer build does not need them.
- Prefer “never checkout” / leave undownloaded over mass `git rm` on the
  long-lived Chromium branch when possible.
- After each phase: update **Status** here with what was removed and whether
  the rebuild worked.

## Continuity

After every tool batch that finishes a step:

1. Update **Status** (`Current phase`, `Last done`, `Next action`).
2. If the chat is summarized, the next agent reads this file before doing
   anything else to hallulium.
3. Do not start RAM optimization until Status says purge phases are done and
   the orphan engine repo exists or is explicitly deferred.
