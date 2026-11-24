"""Find hallu.exe ninja inputs that are missing from the source tree."""
import os

SRC = r"C:\hallulium\src"
RELEASE = os.path.join(SRC, "out", "Release")
INPUTS = r"C:\halluium-repo\purge\android ios purge 2\_hallu_inputs.txt"
OUT = r"C:\halluium-repo\purge\android ios purge 2\_hallu_missing.txt"

raw_bytes = open(INPUTS, "rb").read()
if raw_bytes.startswith(b"\xff\xfe") or raw_bytes.startswith(b"\xfe\xff"):
    text = raw_bytes.decode("utf-16")
elif b"\x00" in raw_bytes[:200]:
    text = raw_bytes.decode("utf-16")
else:
    text = raw_bytes.decode("utf-8", "replace")

missing = []
total = 0
for line in text.splitlines():
    raw = line.strip().strip('"').replace("\\", "/")
    if not raw:
        continue
    total += 1
    if raw.startswith("../../"):
        rel = raw[6:]
        path = os.path.normpath(os.path.join(SRC, *rel.split("/")))
    elif os.path.isabs(raw):
        path = raw
        rel = raw
    else:
        path = os.path.normpath(os.path.join(RELEASE, *raw.split("/")))
        rel = raw
    if not os.path.lexists(path):
        missing.append(rel)

with open(OUT, "w", encoding="utf-8", newline="\n") as handle:
    handle.write(f"inputs {total} missing {len(missing)}\n")
    for rel in missing:
        handle.write(rel + "\n")
print(f"inputs {total} missing {len(missing)}")
src_missing = [rel for rel in missing if not os.path.isabs(rel) and not rel.startswith("obj/") and not rel.startswith("gen/")]
print(f"source-looking missing {len(src_missing)}")
for rel in src_missing[:80]:
    print(rel)
if len(src_missing) > 80:
    print(f"... {len(src_missing) - 80} more")
