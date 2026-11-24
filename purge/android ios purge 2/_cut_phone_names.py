"""Delete real Android/iOS named paths, keeping the false-match list and chrome/android."""
import os
import shutil
import stat
import sys

APPEARANCES = r"C:\halluium-repo\purge\android ios purge 2\android-ios-appearances.md"
FALSE = r"C:\halluium-repo\purge\android ios purge 2\false-matches.md"
SRC = r"C:\hallulium\src"
MANIFEST = r"C:\halluium-repo\purge\android ios purge 2\phone-name-cut.md"
FALSE_RUNS = ("iosurface", "iostream", "iosfwd", "iostat", "iosock")


def is_real_ios_name(text):
    low = text.lower()
    start = 0
    while True:
        index = low.find("ios", start)
        if index < 0:
            return False
        start = index + 1
        span = text[index:index + 3]
        before = text[index - 1] if index else ""
        run_match = __import__("re").match(r"[A-Za-z0-9]+", text[index:])
        run = run_match.group(0).lower() if run_match else ""
        before_open = before == "" or not before.isalnum()
        after = text[index + 3] if index + 3 < len(text) else ""
        if span.isupper() and not after.islower():
            return True
        if before_open and run == "ios":
            return True
        if before_open and run.startswith("ios") and run[3:].isdigit():
            return True
        if before_open and (run.startswith("iossim") or run.startswith("iosbuild")):
            return True
        if before in ("_", "-", ".") and not any(run.startswith(root) for root in FALSE_RUNS):
            return True
    return False


def is_phone_leaf(text):
    if "android" in text.lower():
        return True
    return is_real_ios_name(text)


def under(rel, prefixes):
    for prefix in prefixes:
        if rel == prefix or rel.startswith(prefix + "/"):
            return True
    return False


def load_keeps():
    folders = set()
    files = set()
    in_phone_parent = False
    for line in open(FALSE, encoding="utf-8"):
        if line.startswith("## Inside a real phone folder"):
            in_phone_parent = True
            continue
        if not line.startswith("- `"):
            continue
        if in_phone_parent:
            continue
        rel = line.split("`", 2)[1]
        if line.rstrip().endswith("— folder"):
            folders.add(rel)
        elif line.rstrip().endswith("— file"):
            files.add(rel)
    return folders, files


def load_appearances():
    folders = []
    files = []
    for line in open(APPEARANCES, encoding="utf-8"):
        if not line.startswith("- `"):
            continue
        rel = line.split("`", 2)[1]
        if " — folder — " in line and "folder name" in line:
            folders.append(rel)
        elif " — file — " in line and "file name" in line:
            files.append(rel)
    return folders, files


def topmost(paths):
    ordered = sorted(paths, key=lambda item: (item.count("/"), len(item)))
    kept = []
    for rel in ordered:
        if under(rel, kept):
            continue
        kept.append(rel)
    return kept


def longpath(path):
    path = os.path.abspath(path)
    if path.startswith("\\\\?\\"):
        return path
    return "\\\\?\\" + path


def make_writable(func, path, exc):
    os.chmod(path, stat.S_IWRITE)
    func(path)


def main():
    dry = "--apply" not in sys.argv
    keep_folders, keep_files = load_keeps()
    folders, files = load_appearances()
    delete_folders = []
    for rel in folders:
        leaf = rel.split("/")[-1]
        if not is_phone_leaf(leaf):
            continue
        if rel in keep_folders or under(rel, keep_folders):
            continue
        if rel == "chrome/android" or rel.startswith("chrome/android/"):
            continue
        delete_folders.append(rel)
    roots = topmost(delete_folders)
    loose = []
    for rel in files:
        leaf = rel.split("/")[-1]
        if not is_phone_leaf(leaf):
            continue
        if rel in keep_files or under(rel, keep_folders):
            continue
        if rel == "chrome/android" or rel.startswith("chrome/android/") or under(rel, ["chrome/android"]):
            continue
        if under(rel, roots):
            continue
        loose.append(rel)

    print(f"keep folders {len(keep_folders)} keep files {len(keep_files)}")
    print(f"phone folder roots {len(roots)} from {len(delete_folders)} phone folders")
    print(f"loose phone files {len(loose)}")
    sentinels = {
        "chrome/android": False,
        "base/android": True,
        "build/toolchain/ios": True,
        "third_party/llvm-libc/src/src/termios": False,
        "extensions/browser/kiosk": False,
        "chrome/test/data/extensions/kiosk": False,
    }
    root_set = set(roots)
    for rel, should in sentinels.items():
        print(f"  delete {rel}? {rel in root_set} expected {should}")
    loose_set = set(loose)
    for rel, should in {
        "base/process/process_android.cc": True,
        "base/process/process_ios.cc": True,
        "electron/shell/browser/extensions/electron_kiosk_delegate.cc": False,
        "third_party/libc++/src/include/iostream": False,
        "gpu/command_buffer/service/shared_image/iosurface_image_backing.mm": False,
    }.items():
        print(f"  loose {rel}? {rel in loose_set} expected {should}")
    stray_roots = [rel for rel in roots if "android" not in rel.lower() and "ios" not in rel.lower()]
    stray_files = [rel for rel in loose if "android" not in rel.lower() and "ios" not in rel.lower()]
    print(f"stray roots {len(stray_roots)} stray files {len(stray_files)}")
    if stray_roots or stray_files:
        print("\n".join(stray_roots[:10] + stray_files[:10]))
        raise SystemExit("refusing to delete a path whose name has neither android nor ios")
    if dry:
        print("dry run")
        return

    removed_dirs = 0
    removed_files = 0
    missing = 0
    errors = []
    for rel in roots:
        path = longpath(os.path.join(SRC, *rel.split("/")))
        if not os.path.isdir(path):
            missing += 1
            continue
        try:
            shutil.rmtree(path, onerror=make_writable)
            removed_dirs += 1
        except OSError as exc:
            errors.append(f"{rel}: {exc}")
    for rel in loose:
        path = longpath(os.path.join(SRC, *rel.split("/")))
        if not os.path.lexists(path):
            missing += 1
            continue
        try:
            os.chmod(path, stat.S_IWRITE)
            os.remove(path)
            removed_files += 1
        except OSError as exc:
            errors.append(f"{rel}: {exc}")

    with open(MANIFEST, "w", encoding="utf-8", newline="\n") as handle:
        handle.write("# Phone-name cut\n\n")
        handle.write("Deleted real Android/iOS named folders and loose files from `C:\\\\hallulium\\\\src`.\n")
        handle.write("Held back the false matches in `false-matches.md` and all of `chrome/android/`.\n\n")
        handle.write(f"Folder roots removed: {removed_dirs} (of {len(roots)}).\n")
        handle.write(f"Loose files removed: {removed_files} (of {len(loose)}).\n")
        handle.write(f"Already absent: {missing}.\n")
        handle.write(f"Errors: {len(errors)}.\n\n")
        if errors:
            handle.write("## Errors\n\n")
            for item in errors:
                handle.write(f"- {item}\n")
            handle.write("\n")
        handle.write("## Folder roots\n\n")
        for rel in roots:
            handle.write(f"- `{rel}`\n")
        handle.write("\n## Loose files\n\n")
        for rel in loose:
            handle.write(f"- `{rel}`\n")
    print(f"removed dirs {removed_dirs} files {removed_files} missing {missing} errors {len(errors)}")
    if errors:
        print("\n".join(errors[:20]))


if __name__ == "__main__":
    main()
