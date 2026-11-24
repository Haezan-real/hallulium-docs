"""Restore source files the Windows ninja graph still compiles."""
import os
import re
import subprocess

SRC = r"C:\hallulium\src"
NINJA = os.path.join(SRC, "third_party", "ninja", "ninja.exe")
GIT = r"C:\Program Files\Git\cmd\git.exe"
LOG = r"C:\halluium-repo\purge\android ios purge 2\_ninja_restore.log"

env = os.environ.copy()
env["DEPOT_TOOLS_WIN_TOOLCHAIN"] = "0"
env["vs2022_install"] = r"C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools"
env["CHROMIUM_BUILDTOOLS_PATH"] = os.path.join(SRC, "buildtools")
depot = r"C:\Users\zeela\.electron_build_tools\third_party\depot_tools"
env["PATH"] = depot + os.pathsep + env.get("PATH", "")

MISSING = re.compile(r"ninja: error: '([^']+)', needed by")


def ninja():
    proc = subprocess.run(
        [NINJA, "-C", "out/Release", "hallu.exe"],
        cwd=SRC,
        env=env,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    text = proc.stdout + "\n" + proc.stderr
    with open(r"C:\halluium-repo\purge\android ios purge 2\_ninja.log", "w", encoding="utf-8", newline="\n") as handle:
        handle.write(text)
    return proc.returncode, text


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


def restore(src_rel):
    abs_path = os.path.normpath(os.path.join(SRC, src_rel.replace("/", os.sep)))
    root = git_root(abs_path)
    rel = os.path.relpath(abs_path, root).replace("\\", "/")
    proc = subprocess.run(
        [GIT, "-C", root, "-c", "maintenance.auto=false", "checkout", "HEAD", "--", rel],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    return proc.returncode, proc.stdout + proc.stderr, rel, root


def main():
    with open(LOG, "w", encoding="utf-8", newline="\n") as log:
        for attempt in range(1, 401):
            code, text = ninja()
            if code == 0:
                log.write(f"ninja ok after {attempt - 1} restores\n")
                print(f"ninja ok after {attempt - 1} restores", flush=True)
                return
            match = MISSING.search(text.replace("\r\n", "\n").replace("\n", " "))
            if not match:
                match = MISSING.search(text)
            if not match:
                log.write("STOPPED\n" + text[-4000:])
                print(text[-2000:], flush=True)
                raise SystemExit(1)
            raw = match.group(1).replace("\\", "/")
            src_rel = os.path.relpath(
                os.path.normpath(os.path.join(SRC, "out", "Release", raw)),
                SRC,
            ).replace("\\", "/")
            status, detail, rel, root = restore(src_rel)
            if status != 0 or not os.path.exists(os.path.join(SRC, *src_rel.split("/"))):
                log.write(f"RESTORE FAILED {src_rel}\n{detail}\n")
                print(f"RESTORE FAILED {src_rel}\n{detail}", flush=True)
                raise SystemExit(1)
            log.write(f"{attempt} restored {src_rel}\n")
            print(f"{attempt} restored {src_rel}", flush=True)


if __name__ == "__main__":
    main()
