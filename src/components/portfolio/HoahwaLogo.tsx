import Image from "next/image";
import Link from "next/link";

export const HOAHWA_LOGO_SRC = "/LOGO HOAHWA/hoahwa_logo_board-03.png";

type HoahwaLogoProps = {
  className?: string;
  width?: number;
  height?: number;
  href?: string;
  priority?: boolean;
};

export function HoahwaLogo({
  className = "h-8 w-auto",
  width = 180,
  height = 48,
  href = "https://hoahwa.com/",
  priority = false,
}: HoahwaLogoProps) {
  const img = (
    <Image
      src={HOAHWA_LOGO_SRC}
      alt="Hoahwa"
      width={width}
      height={height}
      priority={priority}
      className={className}
    />
  );

  if (!href) return img;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex transition-opacity hover:opacity-85"
    >
      {img}
    </Link>
  );
}
