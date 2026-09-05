#!/usr/bin/env python3
"""Apply Hoahwa's content layer over the mirrored Vietfolk '26 edition page.

Why this is separate from patch-winter2026-hoahwa.py:
  That script does *structural* work — SEO head, favicons, hiding unsupported
  collections, stripping the hero backdrop from the GLB. This one only rewrites
  *content*: prose and outbound links. Keeping them apart means the wording can
  change without touching asset-patching logic.

How content reaches the screen:
  The page is a mirror of a Remix app. Every visible string exists twice — once
  in the server-rendered markup and once in the serialized router payload that
  hydration renders from. The inner text is byte-identical in both, so a single
  literal replacement covers both. Editing only the markup would look correct
  until hydration silently replaced it.

Loud failure is the point:
  A mapping that stops matching (because the mirror was re-captured, or a string
  was edited by hand) must be an error, not a no-op. A silently-inert filter is
  exactly how the mobile navigation kept dead #retail links after the sections
  were removed. Every entry declares min_matches and every URL must resolve to a
  rule, or this script exits non-zero and writes nothing.

Usage:
  python3 scripts/apply-winter2026-content.py --dry-run   # report, write nothing
  python3 scripts/apply-winter2026-content.py             # apply
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "public/editions/winter2026/index.html"
CONTENT_DIR = Path(__file__).resolve().parent / "winter2026-content"

# Matches a URL in either form the page stores them in: plain from the markup, or
# with \uXXXX-escaped punctuation from the JSON payload. Both the slashes (/)
# and the query separators (&) come through escaped, and a class that stops at
# the backslash truncates the URL mid-query — which silently leaves the tail of the
# old query string glued onto the new destination.
URL_RE = re.compile(r'https?:(?:\\u002F\\u002F|//)(?:\\u00[0-9A-Fa-f]{2}|[^"\'<>\s\\])+')

# Hosts whose links are Shopify's own and therefore need remapping. Anything else
# (schema.org, w3.org, the fonts CDN) is left alone.
SHOPIFY_HOST_RE = re.compile(
    r"(shopify\.com|shopify\.dev|shop\.app|myshopify\.com|lovable\.dev)"
)

# cdn.shopify.com serves the mirrored assets themselves — never rewrite those.
SKIP_URL_RE = re.compile(r"^https?://cdn\.shopify\.com")


ESCAPE_RE = re.compile(r"\\u00([0-9A-Fa-f]{2})")


def unescape_url(raw: str) -> str:
    """Normalise a stored URL to a plain one so rules can be matched against it."""
    decoded = ESCAPE_RE.sub(lambda m: chr(int(m.group(1), 16)), raw)
    return decoded.replace("&amp;", "&")


def escape_like(target: str, raw: str) -> str:
    """Render `target` using the same slash escaping the original occurrence used."""
    return target.replace("/", "\\u002F") if "\\u002F" in raw else target


def load_json(name: str) -> dict:
    path = CONTENT_DIR / name
    if not path.exists():
        sys.exit(f"missing content file: {path}")
    return json.loads(path.read_text(encoding="utf-8"))


def html_escape(text: str) -> str:
    """Escape the way the server-rendered markup does."""
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&#x27;")
    )


def string_forms(text: str) -> list[str]:
    """The distinct spellings one sentence has in this file.

    The payload stores an apostrophe literally while the markup stores it as
    `&#x27;`, so a sentence containing one exists in two different byte
    sequences. Replacing only the literal form leaves the markup in English —
    visible before hydration, and to anything that does not run JavaScript.
    """
    escaped = html_escape(text)
    return [text] if escaped == text else [text, escaped]


def apply_prose(
    text: str, entries: list[dict], scope: str = "page"
) -> tuple[str, list[str], list[dict]]:
    """Replace each declared source string in every spelling it appears in.

    `scope` filters entries by where they live. A few strings exist only in a JS
    chunk and a few only in the HTML — without this, each would be reported as
    drift by the pass that was never going to find it.

    Three outcomes per entry, and telling them apart is what makes this safe to
    re-run: the source is still there (apply it), the replacement is already
    there (a previous run did it — skip quietly), or neither is present (the
    mirror drifted out from under the mapping — that is an error).
    """
    errors: list[str] = []
    report: list[dict] = []
    for entry in entries:
        if entry.get("scope", "both") not in (scope, "both"):
            continue
        find = entry["find"]
        replace = entry["replace"]
        minimum = int(entry.get("min_matches", 1))

        found = 0
        for form in string_forms(find):
            hits = text.count(form)
            if hits:
                found += hits
                # Escape the replacement to match the form being replaced, so an
                # entity-escaped occurrence stays entity-escaped.
                text = text.replace(
                    form, html_escape(replace) if form != find else replace
                )

        if found >= minimum:
            report.append({"id": entry["id"], "matches": found, "state": "applied"})
            continue

        already = sum(text.count(f) for f in string_forms(replace))
        if already >= minimum:
            report.append(
                {"id": entry["id"], "matches": already, "state": "already"}
            )
        else:
            errors.append(
                f"{entry['id']}: source matched {found}x and replacement "
                f"{already}x across all spellings, expected >= {minimum} "
                f"— mapping drifted: {find[:60]!r}"
            )
    return text, errors, report


MISSING = object()


def resolve_link(url: str, rules: list[dict]):
    """Return the mapped destination, None for a deliberate keep, or MISSING when
    no rule covers the URL at all. Distinguishing the last two is the point: an
    uncovered URL is an unreviewed decision and must fail the run."""
    for rule in rules:
        if re.search(rule["pattern"], url):
            return rule["target"]
    return MISSING


def apply_links(text: str, rules: list[dict]) -> tuple[str, list[str], Counter, Counter]:
    """Rewrite every Shopify-family URL to its mapped Hoahwa destination."""
    by_label: Counter = Counter()
    by_target: Counter = Counter()
    unresolved: set[str] = set()

    # Collect first, replace after, so replacements cannot match each other.
    occurrences: dict[str, str] = {}
    for match in URL_RE.finditer(text):
        raw = match.group(0)
        plain = unescape_url(raw)
        if SKIP_URL_RE.match(plain) or not SHOPIFY_HOST_RE.search(plain):
            continue
        target = resolve_link(plain, rules)
        if target is MISSING:
            unresolved.add(plain)
            continue
        label = next(r["label"] for r in rules if re.search(r["pattern"], plain))
        if target is None:
            by_label[label] += 1  # counted so keeps stay visible in the report
            continue
        occurrences[raw] = escape_like(target, raw)
        by_label[label] += 1
        by_target[target] += 1

    # Longest first: a short URL must not clobber a longer one that contains it.
    for raw in sorted(occurrences, key=len, reverse=True):
        text = text.replace(raw, occurrences[raw])

    errors = [f"unresolved URL (no rule matched): {u}" for u in sorted(unresolved)]
    return text, errors, by_label, by_target


# These anchors were authored for outbound links, so they carry
# target="_blank" rel="noreferrer". Now that they point inside the site, that
# spawns a tab for ordinary navigation and rel="noreferrer" hides our own
# referrer from our own analytics. This runs on its own rather than inside the
# link pass, because on a re-run the links are already internal and that pass
# has nothing to do — the attributes would stay wrong forever.
# Matched at whole-tag level on purpose. The attributes appear in several orders
# and only some anchors carry a rel, so a fixed `href … target … rel` string only
# catches a fraction of them.
ANCHOR_RE = re.compile(r"<a\s[^>]*>")
HREF_RE = re.compile(r'href="([^"]*)"')
TARGET_ATTR_RE = re.compile(r'\s+target="_blank"')
REL_ATTR_RE = re.compile(r'\s+rel="(?:noreferrer|noopener|noopener noreferrer|noreferrer noopener)"')


def strip_blank_target(text: str) -> tuple[str, int]:
    """Drop target/rel from anchors that now point inside the site."""
    fixed = 0

    def fix(match: re.Match) -> str:
        nonlocal fixed
        tag = match.group(0)
        href = HREF_RE.search(tag)
        if not href or not href.group(1).startswith("/"):
            return tag
        new = REL_ATTR_RE.sub("", TARGET_ATTR_RE.sub("", tag))
        if new != tag:
            fixed += 1
        return new

    return ANCHOR_RE.sub(fix, text), fixed


def bundle_targets() -> list[Path]:
    """Every mirrored JS file — link rules only touch Shopify URLs, so a wide net
    is safe and avoids missing a copy of a chunk the mirror duplicated."""
    root = ROOT / "public/assets/vietfolk-winter2026"
    return sorted(p for p in root.rglob("*.js") if p.is_file())


def apply_bundle_patches(entries: list[dict]) -> tuple[dict[Path, str], list[str], list[dict]]:
    """Apply literal patches to the bundles matching each entry's glob(s)."""
    root = ROOT / "public/assets/vietfolk-winter2026"
    edits: dict[Path, str] = {}
    errors: list[str] = []
    report: list[dict] = []
    for entry in entries:
        paths: list[Path] = []
        for pattern in entry["files"]:
            paths += [p for p in root.glob(pattern) if p.is_file()]
        paths = sorted(set(paths))
        if not paths:
            errors.append(f"{entry['id']}: no bundle matched {entry['files']}")
            continue
        hits = 0
        for path in paths:
            text = edits.get(path, path.read_text(encoding="utf-8"))
            if entry["find"] in text:
                edits[path] = text.replace(entry["find"], entry["replace"])
                hits += 1
            elif entry["replace"] in text:
                hits += 1  # a previous run already did this file
        if hits < int(entry.get("min_matches", 1)):
            errors.append(
                f"{entry['id']}: anchor absent from all {len(paths)} candidate "
                f"bundle(s) — mapping drifted: {entry['find'][:60]!r}"
            )
            continue
        report.append({"id": entry["id"], "files": hits, "candidates": len(paths)})
    return edits, errors, report


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    errors: list[str] = []
    writes: dict[Path, str] = {}

    original = PAGE.read_text(encoding="utf-8")
    text = original

    # Every JSON here except the two rule files is a prose batch, so adding a new
    # batch is a matter of dropping in a file — no code change, and the same
    # match validation applies to it automatically.
    prose_entries: list[dict] = []
    for path in sorted(CONTENT_DIR.glob("*.json")):
        if path.name in {"link-rules.json", "bundle-patches.json"}:
            continue
        prose_entries += json.loads(path.read_text(encoding="utf-8"))["entries"]
    prose_doc = {"entries": prose_entries}
    text, prose_errors, prose_report = apply_prose(text, prose_entries, "page")
    errors += prose_errors

    link_doc = load_json("link-rules.json")
    text, link_errors, by_label, by_target = apply_links(text, link_doc["rules"])
    errors += link_errors
    text, blank_fixed = strip_blank_target(text)
    if text != original:
        writes[PAGE] = text

    # The page builds some URLs and holds some copy at runtime, so both passes
    # have to run over the JS chunks too — the HTML payload does not contain
    # them, and prose living only in a bundle would stay in English on screen.
    bundle_link_counts: Counter = Counter()
    bundle_prose_counts: Counter = Counter()
    for path in bundle_targets():
        src = path.read_text(encoding="utf-8")
        patched, errs, _, targets = apply_links(src, link_doc["rules"])
        errors += [f"{path.name}: {e}" for e in errs]
        if patched != src:
            bundle_link_counts[path.name] = sum(targets.values())
        # Prose in bundles is best-effort: an entry that only lives in the HTML
        # must not be reported as drift here, so errors from this pass are dropped.
        before = patched
        patched, _, rep = apply_prose(patched, prose_entries, "bundle")
        if patched != before:
            bundle_prose_counts[path.name] = sum(
                1 for r in rep if r["state"] == "applied"
            )
        if patched != src:
            writes[path] = patched

    patch_doc = load_json("bundle-patches.json")
    bundle_edits, patch_errors, patch_report = apply_bundle_patches(patch_doc["entries"])
    errors += patch_errors
    for path, patched in bundle_edits.items():
        # A bundle may already be queued from the link pass; re-apply on top.
        base = writes.get(path)
        if base is not None and base != patched:
            for entry in patch_doc["entries"]:
                if entry["find"] in base:
                    base = base.replace(entry["find"], entry["replace"])
            writes[path] = base
        else:
            writes[path] = patched

    applied = sum(1 for i in prose_report if i["state"] == "applied")
    already = sum(1 for i in prose_report if i["state"] == "already")
    print(
        f"\nprose: {len(prose_report)}/{len(prose_doc['entries'])} entries resolved "
        f"({applied} applied, {already} already in place)"
    )
    for item in prose_report:
        print(f"  {item['matches']}x  {item['state']:<7}  {item['id']}")

    print(f"\nlinks in page: {sum(by_target.values())} occurrences rewritten")
    for label, n in by_label.most_common():
        print(f"  {n:>4}  {label}")
    print("  destination totals:")
    for target, n in by_target.most_common():
        print(f"  {n:>4}  {target}")

    print(f"\ninternal anchors un-blanked: {blank_fixed}")

    if bundle_link_counts:
        print(f"\nlinks in bundles: {sum(bundle_link_counts.values())} occurrences")
        for name, n in bundle_link_counts.most_common():
            print(f"  {n:>4}  {name}")

    if bundle_prose_counts:
        print(f"\nprose in bundles: {sum(bundle_prose_counts.values())} replacements")
        for name, n in bundle_prose_counts.most_common():
            print(f"  {n:>4}  {name}")

    print(f"\nbundle patches: {len(patch_report)}/{len(patch_doc['entries'])} resolved")
    for item in patch_report:
        print(f"  {item['files']}/{item['candidates']} file(s)  {item['id']}")

    if errors:
        print(f"\n{len(errors)} ERROR(S) — nothing written:")
        for e in errors:
            print(f"  ! {e}")
        sys.exit(1)

    print(f"\nfiles to write: {len(writes)}")
    if args.dry_run:
        for path in sorted(writes):
            print(f"  would write {path.relative_to(ROOT)}")
        print("dry run — nothing written")
        return

    for path, content in sorted(writes.items()):
        path.write_text(content, encoding="utf-8")
        print(f"  wrote {path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
