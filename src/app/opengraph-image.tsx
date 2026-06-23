import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/seo";

/**
 * Default social share image for the whole site, generated at build time
 * (statically optimized — compatible with `output: "export"`). Individual
 * routes inherit this unless they define their own opengraph-image.
 */
export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Required for `output: "export"` — render this image at build time.
export const dynamic = "force-static";

// Brand palette (default "windy" vibe).
const DEEP = "#3E5F44";
const MID = "#5E936C";
const LIGHT = "#E8FFD7";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: `linear-gradient(135deg, ${DEEP} 0%, ${MID} 100%)`,
          color: LIGHT,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 32, letterSpacing: "-0.02em" }}>
          {SITE_URL.replace(/^https?:\/\//, "")}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 120,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            {SITE_NAME}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 44,
              letterSpacing: "-0.02em",
              opacity: 0.9,
            }}
          >
            {SITE_TAGLINE}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 28, opacity: 0.8 }}>
          High-performance Shopify storefronts · CRO · Design-led growth
        </div>
      </div>
    ),
    { ...size },
  );
}
