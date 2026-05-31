import { HoahwaLogo } from "@/components/portfolio/HoahwaLogo";

export function PoweredByHoahwa({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`portfolio-powered-by border-t border-white/10 bg-black ${
        compact ? "py-2" : "py-6"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-center px-4">
        <HoahwaLogo
          className={compact ? "h-5 w-auto" : "h-9 w-auto sm:h-10"}
          width={compact ? 120 : 200}
          height={compact ? 28 : 52}
        />
      </div>
    </div>
  );
}
