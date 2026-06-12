import { figmaAssets } from "@/content/figma-assets";

/** Floral divider — white overlay, slow drift above footer transition */
export function DecorativeBorderMarquee() {
  return (
    <div
      className="relative z-50 -mt-10 w-full overflow-x-clip bg-[var(--wiro-black)]"
      aria-hidden
      data-node-id="24:1243"
      data-name="Decorative border"
    >
      <div className="h-20 overflow-hidden md:h-24">
        <div className="animate-decor-marquee-wobble">
          <div className="flex w-max animate-decor-marquee">
            {Array.from({ length: 4 }).map((_, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={figmaAssets.decorativeBorder}
                alt=""
                className="h-40 w-[min(1280px,100vw)] shrink-0 object-cover object-left-top brightness-0 invert md:h-48"
                draggable={false}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
