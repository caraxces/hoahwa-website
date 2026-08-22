#!/usr/bin/env python3
"""Patch Vietfolk winter2026: Hoahwa legal URLs + favicon/SEO for portfolio."""

from __future__ import annotations

import json
import re
import struct
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"

HOAHWA_TERMS = "https://hoahwa.com/terms"
HOAHWA_PRIVACY = "https://hoahwa.com/privacy"
PAGE_URL = "https://hoahwa.com/editions/winter2026/"
TITLE = "Vietfolk ’26 | Hoahwa"
DESCRIPTION = (
    "Portfolio Shopify Developer Việt Nam by Hoahwa: theme nhanh, storefront sạch, "
    "motion giàu chiều sâu — The Renaissance Edition (Vietfolk ’26)."
)
OG_IMAGE = (
    "https://hoahwa.com/assets/vietfolk-winter2026/downloaded/images/"
    "share-827c0cbcff.png"
)
ICON = "/logo-hoahwa/hoahwa_logo_board-07.png"
SHORTCUT = "/logo-hoahwa/hoahwa_logo_board-03.png"
EXCLUDED_COLLECTION_HANDLES = ("retail", "shop-app")
EXPERIENCE_STYLE_MARKER = "hoahwa-winter2026-customizations"
HERO_BACKGROUND_NODE = "Vietfolk_Hero_Background"


def patch_legal_urls(text: str) -> tuple[str, int]:
    n = 0
    pairs = [
        ("https://www.shopify.com/legal/terms", HOAHWA_TERMS),
        ("https://www.shopify.com/legal/privacy", HOAHWA_PRIVACY),
        (
            "https:\\u002F\\u002Fwww.shopify.com\\u002Flegal\\u002Fterms",
            HOAHWA_TERMS.replace("/", "\\u002F"),
        ),
        (
            "https:\\u002F\\u002Fwww.shopify.com\\u002Flegal\\u002Fprivacy",
            HOAHWA_PRIVACY.replace("/", "\\u002F"),
        ),
        ('\\"https://www.shopify.com/legal/terms\\"', f'\\"{HOAHWA_TERMS}\\"'),
        ('\\"https://www.shopify.com/legal/privacy\\"', f'\\"{HOAHWA_PRIVACY}\\"'),
        ("https://shopify.com/legal/terms", HOAHWA_TERMS),
        ("https://shopify.com/legal/privacy", HOAHWA_PRIVACY),
    ]
    for old, new in pairs:
        c = text.count(old)
        if c:
            text = text.replace(old, new)
            n += c
    return text, n


def _set_meta(
    html: str,
    *,
    name: str | None = None,
    prop: str | None = None,
    content: str | None = None,
    remove: bool = False,
) -> str:
    if name:
        pat = rf'<meta name="{re.escape(name)}"[^>]*/?>'
        attr = f'name="{name}"'
    else:
        assert prop is not None
        if prop == "og:image":
            pat = r'<meta(?: name="image")? property="og:image"[^>]*/?>'
        else:
            pat = rf'<meta property="{re.escape(prop)}"[^>]*/?>'
        attr = f'property="{prop}"'
    if remove:
        return re.sub(pat, "", html, count=1)
    repl = f'<meta {attr} content="{content}"/>'
    if re.search(pat, html):
        return re.sub(pat, repl, html, count=1)
    return html.replace("</head>", repl + "</head>", 1)


def patch_seo_and_favicon(html: str) -> tuple[str, int]:
    """Rewrite winter2026 head for Hoahwa portfolio SEO + favicon."""
    if "editions/winter2026" not in html and "Vietfolk" not in html:
        return html, 0
    before = html

    html = re.sub(r"<title>[^<]*</title>", f"<title>{TITLE}</title>", html, count=1)
    html = _set_meta(html, name="description", content=DESCRIPTION)
    html = _set_meta(
        html, name="robots", content="index, follow, max-image-preview:large"
    )
    html = _set_meta(html, name="twitter:card", content="summary_large_image")
    html = _set_meta(html, name="twitter:site", remove=True)
    html = _set_meta(html, name="twitter:account_id", remove=True)
    html = _set_meta(html, name="twitter:title", content=TITLE)
    html = _set_meta(html, name="twitter:description", content=DESCRIPTION)
    html = _set_meta(html, name="twitter:image", content=OG_IMAGE)
    html = _set_meta(html, prop="og:description", content=DESCRIPTION)
    html = _set_meta(html, prop="og:image", content=OG_IMAGE)
    html = _set_meta(html, prop="og:site_name", content="Hoahwa")
    html = _set_meta(html, prop="og:title", content=TITLE)
    html = _set_meta(html, prop="og:type", content="website")
    html = _set_meta(html, prop="og:url", content=PAGE_URL)

    html = re.sub(r'<link rel="icon"[^>]*>', "", html)
    html = re.sub(r'<link rel="apple-touch-icon"[^>]*>', "", html)
    html = re.sub(r'<link rel="shortcut icon"[^>]*>', "", html)
    favicon_block = (
        f'<link rel="icon" type="image/png" href="{ICON}"/>'
        f'<link rel="shortcut icon" type="image/png" href="{SHORTCUT}"/>'
        f'<link rel="apple-touch-icon" href="{ICON}"/>'
    )
    html = html.replace("</head>", favicon_block + "</head>", 1)

    html = re.sub(
        r'<link href="https://www\.shopify\.com[^"]*" hrefLang="[^"]*" rel="alternate"/>',
        "",
        html,
    )
    if 'hrefLang="vi"' not in html:
        html = html.replace(
            "</head>",
            f'<link href="{PAGE_URL}" hrefLang="vi" rel="alternate"/>'
            f'<link href="{PAGE_URL}" hrefLang="x-default" rel="alternate"/>'
            "</head>",
            1,
        )

    html = re.sub(
        r'<link rel="canonical" href="[^"]+"/>',
        f'<link rel="canonical" href="{PAGE_URL}"/>',
        html,
        count=1,
    )
    html = html.replace('<html lang="en"', '<html lang="vi"', 1)
    html = html.replace(
        '["U","https://www.shopify.com/editions/winter2026"]',
        f'["U","{PAGE_URL.rstrip("/")}"]',
    )
    html = html.replace(
        "https://www.shopify.com/editions/winter2026",
        PAGE_URL.rstrip("/"),
    )

    ld = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": TITLE,
        "description": DESCRIPTION,
        "url": PAGE_URL,
        "isPartOf": {
            "@type": "WebSite",
            "name": "Hoahwa",
            "url": "https://hoahwa.com/",
        },
        "about": {
            "@type": "Organization",
            "name": "Hoahwa",
            "url": "https://hoahwa.com/",
            "logo": f"https://hoahwa.com{ICON}",
        },
        "image": OG_IMAGE,
        "inLanguage": "vi",
    }
    html = re.sub(
        r'<script type="application/ld\+json">[\s\S]*?</script>', "", html
    )
    html = html.replace(
        "</head>",
        f'<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script></head>',
        1,
    )

    return html, (0 if html == before else 1)


def patch_experience_html(html: str) -> tuple[str, int]:
    """Prevent excluded Shopify collections from flashing before hydration."""
    if EXPERIENCE_STYLE_MARKER in html:
        return html, 0

    excluded_selectors = ",".join(
        [f'section#{handle}' for handle in EXCLUDED_COLLECTION_HANDLES]
        + [
            f'a[href$="#{handle}"]'
            for handle in EXCLUDED_COLLECTION_HANDLES
        ]
    )
    style = (
        f'<style id="{EXPERIENCE_STYLE_MARKER}">'
        f"{excluded_selectors}{{display:none!important}}"
        "</style>"
    )
    return html.replace("</head>", style + "</head>", 1), 1


def patch_experience_bundle(text: str) -> tuple[str, int]:
    """Trim the hero backdrop and unsupported Shopify collections at runtime."""
    before = text

    # HeroScene receives a GLB foreground plus a KTX2 backdrop. Keep the model
    # and skip the heavy backdrop that visually overlaps the custom hero art.
    text = text.replace(
        "(a=t.backgroundAssets)==null?void 0:a.map((i,m)=>",
        '(a=t.backgroundAssets)==null?void 0:a.filter(i=>!i.url?.endsWith(".ktx2")).map((i,m)=>',
    )

    # Keep the source payload intact, but filter unsupported collections before
    # navigation, DOM sections and WebGL scenes are constructed. Re-indexing is
    # then handled naturally by the existing map calls.
    route_anchor = "showDebugInfo:m}=we(),f="
    if route_anchor in text:
        filtered_state = (
            "showDebugInfo:m}=we(),"
            'hoahwaCollections=(t??[]).filter(v=>v.handle!=="retail"&&v.handle!=="shop-app"),'
            "hoahwaNavItems=(n??[]).filter(v=>![\"retail\",\"shop-app\"]"
            ".some(C=>v.url?.endsWith(`#${C}`))),f="
        )
        text = text.replace(route_anchor, filtered_state, 1)
        text = text.replace(
            "navItems:n,globalContent:a",
            "navItems:hoahwaNavItems,globalContent:a",
            1,
        )
        text = text.replace(
            "hero:o,collections:t,globalBackgroundAssets:",
            "hero:o,collections:hoahwaCollections,globalBackgroundAssets:",
            1,
        )
        text = text.replace(
            "t&&r.jsx(Wr,{collections:t})",
            "hoahwaCollections.length>0&&r.jsx(Wr,{collections:hoahwaCollections})",
            1,
        )
        text = text.replace(
            "children:t&&t.map((v,C)=>",
            "children:hoahwaCollections.map((v,C)=>",
            1,
        )

    return text, (0 if text == before else 1)


def patch_hero_glb(path: Path) -> bool:
    """Remove the embedded market backdrop while retaining hero foreground art."""
    raw = path.read_bytes()
    if len(raw) < 20 or raw[:4] != b"glTF":
        raise ValueError(f"Not a GLB file: {path}")

    magic, version, _ = struct.unpack_from("<III", raw, 0)
    chunks: list[tuple[int, bytes]] = []
    cursor = 12
    changed = False

    while cursor < len(raw):
        chunk_length, chunk_type = struct.unpack_from("<II", raw, cursor)
        chunk_start = cursor + 8
        chunk_data = raw[chunk_start : chunk_start + chunk_length]
        cursor = chunk_start + chunk_length

        if chunk_type == 0x4E4F534A:  # JSON
            document = json.loads(chunk_data.rstrip(b" \t\r\n\x00"))
            background_indices = {
                index
                for index, node in enumerate(document.get("nodes", []))
                if node.get("name") == HERO_BACKGROUND_NODE
            }
            if background_indices:
                for scene in document.get("scenes", []):
                    original_nodes = scene.get("nodes", [])
                    filtered_nodes = [
                        node
                        for node in original_nodes
                        if node not in background_indices
                    ]
                    if filtered_nodes != original_nodes:
                        scene["nodes"] = filtered_nodes
                        changed = True

            if changed:
                chunk_data = json.dumps(
                    document, ensure_ascii=False, separators=(",", ":")
                ).encode("utf-8")
                chunk_data += b" " * ((-len(chunk_data)) % 4)

        chunks.append((chunk_type, chunk_data))

    if not changed:
        return False

    rebuilt_chunks = b"".join(
        struct.pack("<II", len(chunk_data), chunk_type) + chunk_data
        for chunk_type, chunk_data in chunks
    )
    rebuilt = struct.pack("<III", magic, version, 12 + len(rebuilt_chunks))
    path.write_bytes(rebuilt + rebuilt_chunks)
    return True


def process_file(path: Path) -> dict:
    raw = path.read_text(encoding="utf-8")
    text, legal = patch_legal_urls(raw)
    seo = 0
    experience = 0
    if path.name == "index.html" and "winter2026" in str(path):
        text, seo = patch_seo_and_favicon(text)
        text, experience = patch_experience_html(text)
    if path.suffix == ".js":
        text, experience = patch_experience_bundle(text)
    changed = text != raw
    if changed:
        path.write_text(text, encoding="utf-8")
    return {
        "file": str(path.relative_to(ROOT)),
        "legal": legal,
        "seo": seo,
        "experience": experience,
        "changed": changed,
    }


def main() -> None:
    targets: list[Path] = [PUBLIC / "editions/winter2026/index.html"]
    for pattern in [
        "**/(_locale).editions.winter2026-cWvCD4qi.js",
        "**/(_locale).editions.winter2026-Cipx_NWR.js",
        "**/__locale_.editions.winter2026-cWvCD4qi*.js",
        "**/GlobalNavigationContainer-BwYHx-2f.js",
        "**/GlobalNavigationContainer-BwYHx-2f-*.js",
        "**/HeroScene-BaRW1AZ9.js",
        "**/HeroScene-BaRW1AZ9-*.js",
    ]:
        targets.extend(PUBLIC.glob(f"assets/vietfolk-winter2026/{pattern}"))
        targets.extend(
            PUBLIC.glob(f"assets/vietfolk-winter2026/**/{pattern.split('/')[-1]}")
        )

    seen: set[Path] = set()
    uniq: list[Path] = []
    for p in targets:
        if not p.exists():
            continue
        rp = p.resolve()
        if rp in seen:
            continue
        seen.add(rp)
        uniq.append(p)

    results = [process_file(p) for p in uniq]
    hero_glb = (
        PUBLIC
        / "assets/vietfolk-winter2026/downloaded/models/"
        "EW26_Hero_251205_compressed-optimized-df054b8770.glb"
    )
    if hero_glb.exists() and patch_hero_glb(hero_glb):
        results.append(
            {
                "file": str(hero_glb.relative_to(ROOT)),
                "experience": 1,
                "changed": True,
            }
        )
    changed = [r for r in results if r.get("changed")]
    print(f"Patched {len(changed)}/{len(results)} files")
    for r in changed:
        print(" -", r)


if __name__ == "__main__":
    main()
