"""List ninja source inputs that no longer exist on disk."""
import os
import re

SRC = r"C:\hallulium\src"
ROOT = os.path.join(SRC, "out", "Release")
PATH_RE = re.compile(r"\.\./\.\./[A-Za-z0-9_./+\-]+")
SKIP_DIRS = {"gen", ".ninja_deps", ".ninja_log", "thinlto-cache", "lto-llvm"}

missing = []
seen = set()
walked = 0
for dirpath, dirnames, filenames in os.walk(ROOT):
    dirnames[:] = [name for name in dirnames if name not in SKIP_DIRS]
    for name in filenames:
        if not name.endswith(".ninja"):
            continue
        walked += 1
        path = os.path.join(dirpath, name)
        with open(path, "r", encoding="utf-8", errors="replace") as handle:
            text = handle.read()
        for match in PATH_RE.finditer(text):
            rel = match.group(0)[6:].replace("\\", "/")
            if rel in seen:
                continue
            seen.add(rel)
            abs_path = os.path.normpath(os.path.join(SRC, *rel.split("/")))
            if not os.path.lexists(abs_path):
                missing.append(rel)

print(f"ninja files {walked} unique paths {len(seen)} missing {len(missing)}")
for rel in missing:
    print(rel)
