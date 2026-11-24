"""Restore hallu.exe source inputs that still exist in git."""
import os
import subprocess

SRC = r"C:\hallulium\src"
MISSING = r"C:\halluium-repo\purge\android ios purge 2\_hallu_missing.txt"
GIT = r"C:\Program Files\Git\cmd\git.exe"
EXTS = {
    ".cc",
    ".h",
    ".hh",
    ".hpp",
    ".cpp",
    ".c",
    ".mm",
    ".m",
    ".proto",
    ".mojom",
    ".py",
    ".gni",
    ".gn",
    ".grdp",
    ".grd",
    ".json",
    ".rs",
    ".inc",
    ".def",
    ".s",
    ".S",
    ".asm",
}

lines = open(MISSING, encoding="utf-8").read().splitlines()[1:]
candidates = []
for rel in lines:
    if rel.startswith("phony/") or os.path.isabs(rel):
        continue
    ext = os.path.splitext(rel)[1]
    if ext not in EXTS:
        continue
    path = os.path.join(SRC, *rel.split("/"))
    if os.path.lexists(path):
        continue
    candidates.append(rel)

print(f"missing sources {len(candidates)}", flush=True)


def git_root(path):
    current = os.path.dirname(path)
    found = SRC
    while True:
        if os.path.isdir(os.path.join(current, ".git")) or os.path.isfile(os.path.join(current, ".git")):
            found = current
            break
        parent = os.path.dirname(current)
        if parent == current:
            break
        current = parent
    return found


ok = 0
fail = 0
by_root = {}
for rel in candidates:
    abs_path = os.path.normpath(os.path.join(SRC, *rel.split("/")))
    root = git_root(abs_path)
    local = os.path.relpath(abs_path, root).replace("\\", "/")
    by_root.setdefault(root, []).append(local)

for root, files in by_root.items():
    print(f"restoring {len(files)} from {root}", flush=True)
    chunk = 80
    for start in range(0, len(files), chunk):
        part = files[start:start + chunk]
        proc = subprocess.run(
            [GIT, "-C", root, "-c", "maintenance.auto=false", "checkout", "HEAD", "--"] + part,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
        )
        if proc.returncode == 0:
            ok += len(part)
        else:
            for one in part:
                proc = subprocess.run(
                    [GIT, "-C", root, "-c", "maintenance.auto=false", "checkout", "HEAD", "--", one],
                    capture_output=True,
                    text=True,
                    encoding="utf-8",
                    errors="replace",
                )
                if proc.returncode == 0:
                    ok += 1
                else:
                    fail += 1
                    print(f"fail {root} {one}: {proc.stderr.strip()}", flush=True)

print(f"restored {ok} failed {fail}", flush=True)
still = 0
for rel in candidates:
    if not os.path.lexists(os.path.join(SRC, *rel.split("/"))):
        still += 1
        print("still missing", rel)
print(f"still missing {still}", flush=True)
