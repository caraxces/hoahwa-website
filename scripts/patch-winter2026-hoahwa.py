#!/usr/bin/env python3
"""Patch Vietfolk winter2026: Hoahwa legal URLs + favicon/SEO for portfolio."""

from __future__ import annotations

import json
import re
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


def process_file(path: Path) -> dict:
    raw = path.read_text(encoding="utf-8")
    text, legal = patch_legal_urls(raw)
    seo = 0
    if path.name == "index.html" and "winter2026" in str(path):
        text, seo = patch_seo_and_favicon(text)
    changed = text != raw
    if changed:
        path.write_text(text, encoding="utf-8")
    return {
        "file": str(path.relative_to(ROOT)),
        "legal": legal,
        "seo": seo,
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
    changed = [r for r in results if r.get("changed")]
    print(f"Patched {len(changed)}/{len(results)} files")
    for r in changed:
        print(" -", r)


if __name__ == "__main__":
    main()
