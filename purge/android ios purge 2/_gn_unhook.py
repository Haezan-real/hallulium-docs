"""Unhook GN imports and deps that point at deleted Android/iOS files."""
import os
import subprocess

GN = r"C:\hallulium\src\buildtools\win\gn.exe"
SRC = r"C:\hallulium\src"
LOG = r"C:\halluium-repo\purge\android ios purge 2\_gn_unhook.log"

env = os.environ.copy()
env["DEPOT_TOOLS_WIN_TOOLCHAIN"] = "0"
env["vs2022_install"] = r"C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools"
env["CHROMIUM_BUILDTOOLS_PATH"] = r"C:\hallulium\src\buildtools"
depot = r"C:\Users\zeela\.electron_build_tools\third_party\depot_tools"
env["PATH"] = depot + os.pathsep + env.get("PATH", "")


def gn_gen():
    proc = subprocess.run(
        [GN, "gen", "out/Release"],
        cwd=SRC,
        env=env,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    return proc.returncode, proc.stdout + "\n" + proc.stderr


def first_error(text):
    lines = text.splitlines()
    for index, line in enumerate(lines):
        if line.startswith("ERROR at //"):
            block = "\n".join(lines[index:index + 6])
            return block
    return text[-2000:]


def parse_error(text):
    for line in text.splitlines():
        if not line.startswith("ERROR at //"):
            continue
        head, _, message = line.partition(": ")
        # ERROR at //path:line:col
        at = head[len("ERROR at //"):]
        path, line_no, _col = at.split(":")
        return path.replace("\\", "/"), int(line_no), message
    return None


def drop_line(rel, line_no):
    path = os.path.join(SRC, *rel.split("/"))
    with open(path, "r", encoding="utf-8", newline="") as handle:
        lines = handle.readlines()
    if line_no < 1 or line_no > len(lines):
        raise SystemExit(f"bad line {rel}:{line_no}")
    removed = lines[line_no - 1]
    message_ok = "import(" in removed or '"' in removed or "'" in removed or "=" in removed
    if not message_ok:
        raise SystemExit(f"refusing to delete non-reference {rel}:{line_no}: {removed!r}")
    del lines[line_no - 1]
    if line_no >= 2:
        previous = lines[line_no - 2]
        stripped = previous.rstrip()
        nxt = lines[line_no - 1] if line_no - 1 < len(lines) else ""
        dangling = stripped.endswith("+=") or (stripped.endswith("=") and "[" not in stripped and "(" not in stripped)
        if dangling and nxt.strip() in ("}", "]", ""):
            del lines[line_no - 2]
            removed = previous + removed
    with open(path, "w", encoding="utf-8", newline="") as handle:
        handle.writelines(lines)
    return removed.rstrip("\n")


def main():
    seen = set()
    with open(LOG, "w", encoding="utf-8", newline="\n") as log:
        for attempt in range(1, 501):
            code, text = gn_gen()
            if code == 0:
                log.write(f"gn gen ok after {attempt - 1} unhooks\n")
                print(f"gn gen ok after {attempt - 1} unhooks", flush=True)
                return
            parsed = parse_error(text)
            block = first_error(text)
            if parsed is None or not (
                "Unable to load" in parsed[2] or "import of" in parsed[2] or "Assignment had no effect" in parsed[2]
            ):
                log.write(f"STOPPED\n{block}\n")
                print(block, flush=True)
                raise SystemExit(1)
            line_text = ""
            path = os.path.join(SRC, *parsed[0].split("/"))
            with open(path, "r", encoding="utf-8", newline="") as handle:
                for number, line in enumerate(handle, 1):
                    if number == parsed[1]:
                        line_text = line
                        break
            if "android" not in line_text.lower() and "ios" not in line_text.lower():
                log.write(f"STOPPED non-phone line\n{block}\n")
                print(block, flush=True)
                raise SystemExit(1)
            key = (parsed[0], parsed[1], line_text.strip())
            if key in seen:
                log.write(f"REPEAT {key}\n{block}\n")
                print(block, flush=True)
                raise SystemExit(1)
            seen.add(key)
            removed = drop_line(parsed[0], parsed[1])
            log.write(f"{attempt} {parsed[0]}:{parsed[1]} {removed}\n")
            print(f"{attempt} {parsed[0]}:{parsed[1]} {removed}", flush=True)


if __name__ == "__main__":
    main()
