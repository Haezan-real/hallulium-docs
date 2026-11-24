"""Drop GN lines that still name deleted hollow trees. No stubs."""
from __future__ import annotations

import os

SRC = r"C:\hallulium\src"
NEEDLES = (
    "//chromeos/",
    "//chromeos:",
    "//chromecast/",
    "//chromecast:",
    "//fuchsia_web/",
    "//fuchsia_web:",
    "//ui/chromeos",
    "//ui/file_manager",
    "//components/chromeos_camera",
    "//components/exo",
    "//infra/orchestrator",
    "input_overlay_resources.pak",
    "chromeos/components/libsegmentation",
)
SKIP_DIRS = {".git", "out", "node_modules", "llvm-build", "rust-toolchain"}


def keep_line(line: str) -> bool:
    s = line.replace("\\", "/")
    return not any(n in s for n in NEEDLES)


def main() -> None:
    touched = 0
    dropped = 0
    for root, dirs, files in os.walk(SRC):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for name in files:
            if not name.endswith((".gn", ".gni")):
                continue
            path = os.path.join(root, name)
            try:
                text = open(path, "r", encoding="utf-8").read()
            except OSError:
                continue
            nl = "\r\n" if "\r\n" in text else "\n"
            lines = text.splitlines()
            next_lines = [ln for ln in lines if keep_line(ln)]
            if next_lines == lines:
                continue
            dropped += len(lines) - len(next_lines)
            touched += 1
            open(path, "w", encoding="utf-8", newline="\n").write(nl.join(next_lines) + (nl if text.endswith(("\n", "\r\n")) else ""))
            print(os.path.relpath(path, SRC).replace("\\", "/"))
    print(f"TOUCHED {touched} DROPPED {dropped}")


if __name__ == "__main__":
    main()
