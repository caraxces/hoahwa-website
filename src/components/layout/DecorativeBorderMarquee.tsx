import { figmaAssets } from "@/content/figma-assets";

/** Checkerboard divider from Hoahwa wireframe — scrolls between page body and footer */
export function DecorativeBorderMarquee() {
  return (
    <div
      className="relative w-full overflow-x-clip overflow-y-hidden bg-[var(--wiro-black)]"
      aria-hidden
      data-node-id="24:1243"
      data-name="Decorative border"
    >
      <div className="flex w-max animate-decor-marquee">
        {Array.from({ length: 4 }).map((_, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={figmaAssets.decorativeBorder}
            alt=""
            className="h-8 w-[min(1280px,100vw)] shrink-0 object-cover object-left md:h-10"
            draggable={false}
          />
        ))}
      </div>
    </div>
  );
}
