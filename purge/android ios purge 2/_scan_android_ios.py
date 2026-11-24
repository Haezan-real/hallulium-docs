"""List hallulium paths where android or ios appears in a name or in file text."""
import os
import subprocess

SRC = r"C:\hallulium\src"
OUT_DIR = r"C:\halluium-repo\purge\android ios purge 2"
OUT = os.path.join(OUT_DIR, "android-ios-appearances.md")
RG = r"c:\Users\zeela\AppData\Local\Programs\cursor\resources\app\node_modules\@cursor\ripgrep-win32-x64\bin\rg.exe"
SKIP_DIRS = {".git", "out", "node_modules", ".vs", ".cipd"}
TAG_ORDER = ("folder name", "file name", "appears in file content", "parent folder name")
TERM_ORDER = ("android", "ios")


def tokens_in_text(text):
    found = []
    if "android" in text:
        found.append("android")
    if "ios" in text:
        found.append("ios")
    return found


def add(entries, rel, kind, tags, terms):
    entry = entries.get(rel)
    if entry is None:
        entry = {"kind": kind, "tags": set(), "terms": set()}
        entries[rel] = entry
    entry["tags"].update(tags)
    entry["terms"].update(terms)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    reuse = os.environ.get("HALLU_REUSE_HITS") == "1"
    searches = {}
    hit_handles = {}
    err_handles = {}
    if reuse:
        print("reusing content search results", flush=True)
    else:
        print("starting content search", flush=True)
        for term in TERM_ORDER:
            hit_path = os.path.join(OUT_DIR, f"_rg_{term}.txt")
            err_path = os.path.join(OUT_DIR, f"_rg_{term}.err")
            hit_handles[term] = open(hit_path, "w", encoding="utf-8", newline="\n")
            err_handles[term] = open(err_path, "w", encoding="utf-8", newline="\n")
            searches[term] = subprocess.Popen(rg_cmd(term), stdout=hit_handles[term], stderr=err_handles[term])

    entries = {}
    folders = 0
    walked = 0
    print("walking names", flush=True)
    for dirpath, dirnames, filenames in os.walk(SRC):
        dirnames[:] = [name for name in dirnames if name not in SKIP_DIRS]
        rel_dir = os.path.relpath(dirpath, SRC)
        if rel_dir == ".":
            parts = []
        else:
            parts = rel_dir.split(os.sep)
        parent_terms = []
        for part in parts[:-1]:
            parent_terms.extend(tokens_in_text(part.lower()))
        parent_terms = [term for term in TERM_ORDER if term in parent_terms]
        own_terms = tokens_in_text(parts[-1].lower()) if parts else []
        if own_terms:
            tags = ["folder name"]
            if parent_terms:
                tags.append("parent folder name")
            terms = [term for term in TERM_ORDER if term in own_terms or term in parent_terms]
            add(entries, "/".join(parts), "folder", tags, terms)
            folders += 1
        for filename in filenames:
            walked += 1
            if walked % 100000 == 0:
                print(f"walked {walked} files, listed {len(entries)}", flush=True)
            file_terms = tokens_in_text(filename.lower())
            tags = []
            if file_terms:
                tags.append("file name")
            if parent_terms or own_terms:
                tags.append("parent folder name")
            if not tags:
                continue
            terms = [term for term in TERM_ORDER if term in file_terms or term in parent_terms or term in own_terms]
            rel = "/".join(parts + [filename]) if parts else filename
            add(entries, rel, "file", tags, terms)
    print(f"name walk done, {walked} files, {len(entries)} entries so far", flush=True)

    content_by_rel = {}
    content_note = ""
    terms = TERM_ORDER if reuse else list(searches)
    for term in terms:
        if not reuse:
            proc = searches[term]
            code = proc.wait()
            hit_handles[term].close()
            err_handles[term].close()
            err_path = os.path.join(OUT_DIR, f"_rg_{term}.err")
            if code not in (0, 1, 2):
                err = ""
                try:
                    with open(err_path, "r", encoding="utf-8", errors="replace") as err_handle:
                        err = err_handle.read(4000)
                except OSError:
                    pass
                raise SystemExit(f"ripgrep {term} failed ({code}): {err}")
            if code == 2:
                content_note = "Ripgrep finished with status 2, so some paths could not be read and are missing from the content tag.\n"
            try:
                os.remove(err_path)
            except OSError:
                pass
        elif term == "android":
            content_note = "Ripgrep finished with status 2, so some paths could not be read and are missing from the content tag.\n"
        hit_path = os.path.join(OUT_DIR, f"_rg_{term}.txt")
        with open(hit_path, "r", encoding="utf-8", errors="replace") as handle:
            for line in handle:
                path = line.strip()
                if not path:
                    continue
                rel = os.path.relpath(path, SRC).replace("\\", "/")
                if rel.startswith("../") or rel == "..":
                    continue
                if any(part in SKIP_DIRS for part in rel.split("/")):
                    continue
                content_by_rel.setdefault(rel, set()).add(term)
        os.remove(hit_path)
        print(f"content search {term} finished", flush=True)

    for rel, which in content_by_rel.items():
        parts = rel.split("/")
        parent_terms = []
        for part in parts[:-1]:
            parent_terms.extend(tokens_in_text(part.lower()))
        parent_terms = [term for term in TERM_ORDER if term in parent_terms]
        file_terms = tokens_in_text(parts[-1].lower())
        tags = ["appears in file content"]
        if file_terms:
            tags.append("file name")
        if parent_terms:
            tags.append("parent folder name")
        terms = [term for term in TERM_ORDER if term in which or term in file_terms or term in parent_terms]
        add(entries, rel, "file", tags, terms)
    print(f"merged {len(content_by_rel)} content hits", flush=True)

    rows = []
    tag_counts = {tag: 0 for tag in TAG_ORDER}
    term_counts = {term: 0 for term in TERM_ORDER}
    file_count = 0
    folder_count = 0
    for rel in sorted(entries, key=str.lower):
        entry = entries[rel]
        tags = [tag for tag in TAG_ORDER if tag in entry["tags"]]
        terms = [term for term in TERM_ORDER if term in entry["terms"]]
        rows.append((rel, entry["kind"], tags, terms))
        if entry["kind"] == "folder":
            folder_count += 1
        else:
            file_count += 1
        for tag in tags:
            tag_counts[tag] += 1
        for term in terms:
            term_counts[term] += 1

    with open(OUT, "w", encoding="utf-8", newline="\n") as handle:
        handle.write("# Android and iOS appearances\n\n")
        handle.write("Scanned `C:\\hallulium\\src` on 23 Nov 2026, relative to `src/`.\n")
        handle.write("Skipped `out/`, `.git`, `node_modules`, `.vs`, and `.cipd`.\n")
        handle.write("Match is a case-insensitive substring, so `ios` also matches inside words such as `scenarios`, `ratios`, `kiosk`, and `bios`.\n")
        handle.write("File contents were searched with ripgrep. Files ripgrep treats as binary were not content-scanned. Content search stops at 32 MB.\n")
        if content_note:
            handle.write(content_note)
        handle.write("\n")
        handle.write("A path can carry more than one tag.\n\n")
        handle.write("| Tag | Meaning |\n|---|---|\n")
        handle.write("| folder name | This folder's own name contains `android` or `ios`. |\n")
        handle.write("| file name | This file's own name contains `android` or `ios`. |\n")
        handle.write("| appears in file content | The file's text contains `android` or `ios`. |\n")
        handle.write("| parent folder name | A parent folder's name contains `android` or `ios`. The file is listed even when its own name and text do not. |\n\n")
        handle.write(f"Entries: {len(rows)} ({folder_count} folders, {file_count} files).\n\n")
        handle.write("Tag counts (an entry can add to more than one):\n\n")
        for tag, count in tag_counts.items():
            handle.write(f"- {tag}: {count}\n")
        handle.write("\nTerm counts:\n\n")
        for term, count in term_counts.items():
            handle.write(f"- {term}: {count}\n")
        handle.write("\n## Entries\n\n")
        for rel, kind, tags, terms in rows:
            handle.write(f"- `{rel}` — {kind} — {', '.join(tags)} — {', '.join(terms)}\n")
    print(f"wrote {len(rows)} entries ({folder_count} folders, {file_count} files) to {OUT}", flush=True)
    print(f"name-walk folders recorded: {folders}", flush=True)


def rg_cmd(term):
    return [
        RG,
        "-l",
        "-i",
        "--no-ignore",
        "--hidden",
        "--no-messages",
        "--max-filesize",
        "32M",
        "--glob",
        "!out/**",
        "--glob",
        "!.git/**",
        "--glob",
        "!**/.git/**",
        "--glob",
        "!node_modules/**",
        "--glob",
        "!.vs/**",
        "--glob",
        "!.cipd/**",
        term,
        SRC,
    ]


if __name__ == "__main__":
    main()
